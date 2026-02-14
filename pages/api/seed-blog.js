import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import admin from "firebase-admin";

// Initialize Firebase Admin (only once)
if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    readFileSync(join(process.cwd(), "serviceAccountKey.json"), "utf8")
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Simple markdown to HTML converter
function markdownToHtml(md) {
  let html = md;

  // Remove the first H1 (title) since it's stored separately
  html = html.replace(/^# .+\n\n/, "");

  // Convert ## headings
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");

  // Convert **bold**
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Convert *italic*
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Convert bullet lists
  html = html.replace(
    /^(- .+(?:\n- .+)*)/gm,
    (match) => {
      const items = match
        .split("\n")
        .map((line) => `<li>${line.replace(/^- /, "")}</li>`)
        .join("\n");
      return `<ul>\n${items}\n</ul>`;
    }
  );

  // Remove category comment
  html = html.replace(/^<!--\s*category:\s*.+?\s*-->\n*/m, "");

  // Convert paragraphs - split by double newlines
  const blocks = html.split(/\n\n+/);
  html = blocks
    .map((block) => {
      block = block.trim();
      if (!block) return "";
      if (block.startsWith("<h2>")) return block;
      if (block.startsWith("<ul>")) return block;
      if (block.startsWith("<img")) return block;
      return `<p>${block}</p>`;
    })
    .filter(Boolean)
    .join("\n\n");

  // Clean up newlines inside paragraphs
  html = html.replace(/<p>([^<]*)\n([^<]*)<\/p>/g, "<p>$1 $2</p>");

  return html;
}

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractTitle(md) {
  const match = md.match(/^# (.+)$/m);
  return match ? match[1] : "Untitled";
}

function extractExcerpt(md) {
  // Get the first paragraph after the title
  const lines = md.split("\n\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("<!--")) {
      return trimmed.slice(0, 200) + (trimmed.length > 200 ? "..." : "");
    }
  }
  return "";
}

function extractCategory(md) {
  const match = md.match(/^<!--\s*category:\s*(.+?)\s*-->/m);
  return match ? match[1] : "actors";
}

function stripMeta(md) {
  return md.replace(/^<!--\s*category:\s*.+?\s*-->\n*/m, "");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      message:
        "Send a POST request to seed blog posts. GET /api/seed-blog for info.",
      instructions: 'curl -X POST http://localhost:3000/api/seed-blog',
    });
  }

  try {
    const contentDir = join(process.cwd(), "content", "blog");
    const files = readdirSync(contentDir).filter((f) => f.endsWith(".md"));

    const results = [];

    for (const file of files) {
      const raw = readFileSync(join(contentDir, file), "utf8");
      const category = extractCategory(raw);
      const md = stripMeta(raw);
      const title = extractTitle(md);
      const slug = slugify(title);
      const excerpt = extractExcerpt(md);
      const content = markdownToHtml(md);

      // Check if post with this slug already exists
      const existing = await db
        .collection("posts")
        .where("slug", "==", slug)
        .limit(1)
        .get();

      if (!existing.empty) {
        results.push({ file, title, slug, status: "skipped (already exists)" });
        continue;
      }

      const now = admin.firestore.FieldValue.serverTimestamp();

      await db.collection("posts").add({
        title,
        slug,
        excerpt,
        content,
        category,
        status: "published",
        imageUrl: "",
        createdAt: now,
        publishedAt: now,
        updatedAt: now,
        author: "CineNovaTV",
      });

      results.push({ file, title, slug, category, status: "created" });
    }

    return res.status(200).json({
      message: `Processed ${results.length} blog posts`,
      results,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return res.status(500).json({ error: error.message });
  }
}
