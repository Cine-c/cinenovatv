'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

type Post = {
  id: string;
  title: string;
  description: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(10));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post));
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-4">CineNovaTV Blog</h1>
      <ul className="space-y-4">
        {posts.map(post => (
          <li key={post.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p>{post.description}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
