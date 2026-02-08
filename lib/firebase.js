import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase app only once
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Helper function to get published blog posts
export async function getPublishedPosts(limitCount = 10) {
  const postsRef = collection(db, "posts");
  const q = query(
    postsRef,
    where("status", "==", "published"),
    orderBy("publishedAt", "desc"),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => serializePost(doc));
}

// Helper function to get all published posts for pagination
export async function getAllPublishedPosts() {
  const postsRef = collection(db, "posts");
  const q = query(
    postsRef,
    where("status", "==", "published"),
    orderBy("publishedAt", "desc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => serializePost(doc));
}

// Helper function to get a single post by slug
export async function getPostBySlug(slug) {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("slug", "==", slug), limit(1));

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  return serializePost(snapshot.docs[0]);
}

// Estimate reading time from HTML content (200 wpm)
function readingTime(html) {
  if (!html) return 1;
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// Convert Firestore Timestamps to ISO strings for JSON serialization
function serializePost(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
    publishedAt: data.publishedAt?.toDate?.()?.toISOString() || null,
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
    readingTime: readingTime(data.content),
  };
}

// Helper function to get all post slugs for sitemap
export async function getAllPostSlugs() {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, where("status", "==", "published"));

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    slug: doc.data().slug,
    updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || null,
  }));
}

export { auth, db, storage };
