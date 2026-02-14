import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

const serviceAccount = JSON.parse(
  readFileSync(join(projectRoot, "serviceAccountKey.json"), "utf8")
);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

function markdownToHtml(md) {
  let html = md;
  html = html.replace(/^<!--\s*category:\s*.+?\s*-->\n*/m, "");
  html = html.replace(/^# .+\n\n/, "");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, "<em>$1</em>");
  html = html.replace(/^(- .+(?:\n- .+)*)/gm, (match) => {
    const items = match
      .split("\n")
      .map((line) => `<li>${line.replace(/^- /, "")}</li>`)
      .join("\n");
    return `<ul>\n${items}\n</ul>`;
  });
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
  html = html.replace(/<p>([\s\S]*?)<\/p>/g, (match, content) => {
    return `<p>${content.replace(/\n/g, " ")}</p>`;
  });
  return html;
}

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/update-post.mjs <markdown-file>");
  process.exit(1);
}

const filePath = join(projectRoot, "content", "blog", slug);
const raw = readFileSync(filePath, "utf8");

const categoryMatch = raw.match(/^<!--\s*category:\s*(.+?)\s*-->/m);
const category = categoryMatch ? categoryMatch[1] : "actors";

const md = raw.replace(/^<!--\s*category:\s*.+?\s*-->\n*/m, "");
const titleMatch = md.match(/^# (.+)$/m);
const title = titleMatch ? titleMatch[1] : "Untitled";

const postSlug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const lines = md.split("\n\n");
let excerpt = "";
for (const line of lines) {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith("#") && !trimmed.startsWith("<!--")) {
    excerpt = trimmed.slice(0, 200) + (trimmed.length > 200 ? "..." : "");
    break;
  }
}

const content = markdownToHtml(raw);

const snapshot = await db
  .collection("posts")
  .where("slug", "==", postSlug)
  .limit(1)
  .get();

if (snapshot.empty) {
  console.error(`No post found with slug: ${postSlug}`);
  process.exit(1);
}

const docRef = snapshot.docs[0].ref;
await docRef.update({
  title,
  excerpt,
  content,
  category,
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
});

console.log(`Updated: "${title}" -> /blog/${postSlug} [${category}]`);
