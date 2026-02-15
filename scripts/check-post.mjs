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

const snapshot = await db
  .collection("posts")
  .where("slug", "==", "alexandra-daddario-in-texas-chainsaw-3d-how-the-future-star-took-on-horror-s-most-iconic-franchise")
  .limit(1)
  .get();

if (snapshot.empty) {
  console.log("Post not found");
} else {
  const data = snapshot.docs[0].data();
  // Find the img tag area
  const idx = data.content.indexOf("capture");
  if (idx > -1) {
    console.log("--- Content around 'capture scene' section ---");
    console.log(data.content.substring(idx - 100, idx + 500));
  } else {
    console.log("No 'capture' found in content");
    console.log("First 500 chars:", data.content.substring(0, 500));
  }
}
