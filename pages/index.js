// pages/index.js
import { useEffect } from "react";
import { auth, db } from "../lib/firebase";

export default function Home() {
  useEffect(() => {
    console.log("Firebase auth object:", auth);
    // You can now use auth, db, storage in your components
  }, []);

  return <div>Welcome to CineNovaTv</div>;
}
