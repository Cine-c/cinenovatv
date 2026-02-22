#!/bin/bash
set -e

# ── CineNovaTV VPS Deploy Script ──
# Usage: ./deploy.sh [--initial-ssl your-domain.com your@email.com]
#
# Run with --initial-ssl on first deploy to obtain Let's Encrypt certificate.
# Subsequent deploys just run: ./deploy.sh

APP_DIR="$(cd "$(dirname "$0")" && pwd)"
COMPOSE_FILE="docker-compose.prod.yml"

cd "$APP_DIR"

# ── Initial SSL certificate setup ──
if [ "$1" = "--initial-ssl" ]; then
    DOMAIN="$2"
    EMAIL="$3"

    if [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
        echo "Usage: ./deploy.sh --initial-ssl yourdomain.com you@email.com"
        exit 1
    fi

    echo "==> Obtaining SSL certificate for $DOMAIN..."

    # Replace placeholder in nginx config with actual domain
    sed -i "s/\${DOMAIN}/$DOMAIN/g" nginx/default.conf

    # Start nginx with a temporary self-signed cert so certbot can do HTTP challenge
    # First, create a dummy cert so nginx can start
    mkdir -p "$APP_DIR/certbot-bootstrap"
    docker compose -f "$COMPOSE_FILE" run --rm --entrypoint "\
        sh -c \"mkdir -p /etc/letsencrypt/live/$DOMAIN && \
        openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
        -keyout /etc/letsencrypt/live/$DOMAIN/privkey.pem \
        -out /etc/letsencrypt/live/$DOMAIN/fullchain.pem \
        -subj '/CN=localhost'\"" certbot

    echo "==> Starting nginx with temporary certificate..."
    docker compose -f "$COMPOSE_FILE" up -d nginx

    echo "==> Requesting real certificate from Let's Encrypt..."
    docker compose -f "$COMPOSE_FILE" run --rm certbot certonly \
        --webroot -w /var/www/certbot \
        -d "$DOMAIN" \
        --email "$EMAIL" \
        --agree-tos \
        --no-eff-email \
        --force-renewal

    echo "==> Reloading nginx with real certificate..."
    docker compose -f "$COMPOSE_FILE" exec nginx nginx -s reload

    echo "==> SSL setup complete for $DOMAIN"
    exit 0
fi

# ── Standard deploy ──
echo "==> Pulling latest code..."
git pull origin main

echo "==> Building and restarting containers..."
docker compose -f "$COMPOSE_FILE" build --no-cache
docker compose -f "$COMPOSE_FILE" up -d

echo "==> Cleaning up old images..."
docker image prune -f

echo "==> Waiting for health check..."
sleep 10

if docker compose -f "$COMPOSE_FILE" ps | grep -q "(healthy)"; then
    echo "==> Deploy successful! App is healthy."
else
    echo "==> Warning: App may still be starting. Check with:"
    echo "    docker compose -f $COMPOSE_FILE ps"
fi
