// This endpoint requires firebase-admin + filesystem access.
// It only works in a Node.js server environment (Docker), not on Cloudflare Workers.
// Use the admin dashboard to manage blog posts instead.

export default async function handler(req, res) {
  return res.status(503).json({
    error: "This endpoint is disabled in the current hosting environment.",
    message: "Use the admin dashboard to manage blog posts.",
  });
}
