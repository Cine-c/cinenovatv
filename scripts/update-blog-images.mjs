import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(
    readFileSync(join(projectRoot, "serviceAccountKey.json"), "utf8")
  );
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Map slug keywords to image filenames
const imageMap = {
  zendaya: "/blog/zendaya.jpg",
  "pedro-pascal": "/blog/pedro-pascal.jpg",
  "florence-pugh": "/blog/florence-pugh.jpg",
  "timoth": "/blog/timothee-chalamet.jpg",
  "anya-taylor": "/blog/anya-taylor-joy.jpg",
  "ryan-gosling": "/blog/ryan-gosling.jpg",
  "margot-robbie": "/blog/margot-robbie.jpg",
  "cillian-murphy": "/blog/cillian-murphy.jpg",
  "austin-butler": "/blog/austin-butler.jpg",
  "sydney-sweeney": "/blog/sydney-sweeney.jpg",
  "alexandra-daddario": "/blog/alexandra-daddario-texas-chainsaw-2.jpg",
};

async function updateImages() {
  const snapshot = await db
    .collection("posts")
    .where("status", "==", "published")
    .get();

  for (const doc of snapshot.docs) {
    const slug = doc.data().slug || "";
    let imageUrl = null;

    for (const [keyword, path] of Object.entries(imageMap)) {
      if (slug.includes(keyword)) {
        imageUrl = path;
        break;
      }
    }

    if (imageUrl) {
      await doc.ref.update({ imageUrl });
      console.log(`OK: "${doc.data().title}" -> ${imageUrl}`);
    } else {
      console.log(`SKIP: "${doc.data().title}" (no matching image)`);
    }
  }

  console.log("\nDone!");
}

updateImages().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
