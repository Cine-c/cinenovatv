import os
import random
import logging
from datetime import datetime
from pathlib import Path

import requests
import tweepy
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")

LOG_FILE = BASE_DIR / "bot.log"
POSTED_FILE = BASE_DIR / "posted.txt"

logging.basicConfig(
    filename=LOG_FILE,
    level=logging.INFO,
    format="%(asctime)s  %(levelname)s  %(message)s",
)

# X / Twitter credentials (OAuth 1.0a)
X_API_KEY = os.getenv("X_API_KEY")
X_API_SECRET = os.getenv("X_API_SECRET")
X_ACCESS_TOKEN = os.getenv("X_ACCESS_TOKEN")
X_ACCESS_TOKEN_SECRET = os.getenv("X_ACCESS_TOKEN_SECRET")

# TMDB credentials
TMDB_API_KEY = os.getenv("TMDB_API_KEY")

# ---------------------------------------------------------------------------
# TMDB – fetch today's trending movies
# ---------------------------------------------------------------------------
def fetch_trending_movies():
    url = "https://api.themoviedb.org/3/trending/movie/day"
    params = {"api_key": TMDB_API_KEY}
    resp = requests.get(url, params=params, timeout=15)
    resp.raise_for_status()
    return resp.json().get("results", [])


# ---------------------------------------------------------------------------
# Duplicate guard – read / write posted IDs
# ---------------------------------------------------------------------------
def load_posted_ids():
    if not POSTED_FILE.exists():
        return set()
    return set(POSTED_FILE.read_text().strip().splitlines())


def save_posted_id(movie_id):
    with open(POSTED_FILE, "a") as f:
        f.write(f"{movie_id}\n")


# ---------------------------------------------------------------------------
# Pick a movie that hasn't been tweeted yet
# ---------------------------------------------------------------------------
def pick_movie(movies, posted_ids):
    unseen = [m for m in movies if str(m["id"]) not in posted_ids]
    if not unseen:
        # All 20 have been posted – reset the log and start fresh
        POSTED_FILE.write_text("")
        logging.info("All trending movies posted. Reset posted.txt.")
        unseen = movies
    return random.choice(unseen)


# ---------------------------------------------------------------------------
# Format the tweet
# ---------------------------------------------------------------------------
def format_tweet(movie):
    title = movie.get("title", "Unknown")
    year = movie.get("release_date", "")[:4]
    rating = movie.get("vote_average", 0)
    overview = movie.get("overview", "")

    # Trim overview so the full tweet stays under 280 chars
    max_overview = 150
    if len(overview) > max_overview:
        overview = overview[: max_overview - 1].rsplit(" ", 1)[0] + "…"

    tweet = (
        f"\U0001f3ac Trending now: {title}"
        f"{f' ({year})' if year else ''}\n"
        f"\u2b50 {rating}/10 — {overview}\n"
        f"\U0001f50d Find where to watch \u2192 cinenovatv.com\n"
        f"#NowTrending #Movies #Streaming"
    )
    return tweet


# ---------------------------------------------------------------------------
# Post to X using v2 API (tweepy.Client)
# ---------------------------------------------------------------------------
def post_tweet(text):
    client = tweepy.Client(
        consumer_key=X_API_KEY,
        consumer_secret=X_API_SECRET,
        access_token=X_ACCESS_TOKEN,
        access_token_secret=X_ACCESS_TOKEN_SECRET,
    )
    response = client.create_tweet(text=text)
    return response


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    logging.info("Bot run started.")

    # 1. Fetch trending movies
    movies = fetch_trending_movies()
    if not movies:
        logging.warning("TMDB returned no trending movies.")
        return

    # 2. Pick one we haven't posted
    posted_ids = load_posted_ids()
    movie = pick_movie(movies, posted_ids)

    # 3. Build tweet text
    tweet_text = format_tweet(movie)
    logging.info("Tweet prepared:\n%s", tweet_text)

    # 4. Post it
    post_tweet(tweet_text)
    logging.info("Tweet posted successfully for movie ID %s.", movie["id"])

    # 5. Record it
    save_posted_id(str(movie["id"]))

    print(f"[{datetime.now():%Y-%m-%d %H:%M}] Tweeted: {movie['title']}")


if __name__ == "__main__":
    main()
