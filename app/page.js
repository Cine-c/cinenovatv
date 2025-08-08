// Example: src/app/page.js or any React component
'use client';

import { useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function Home() {
  useEffect(() => {
    const loadPosts = async () => {
      const snapshot = await getDocs(collection(db, 'posts'));
      snapshot.forEach(doc => {
        console.log(doc.id, doc.data());
      });
    };
    loadPosts();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-cyan-400">CineNova Blog</h1>
    </main>
  );
}
