
# CineNovaTV – Frontend (Firestore)

This package contains:
- `index.html` Home page with dynamic news grid, Trending, and Categories (filters)
- `post.html` Post detail page with view counter (best effort)
- `styles.css` Shared styles
- `js/app.js` Home page logic
- `js/post.js` Post page logic

## Requirements
Create `/config.js` at your site root with your Firebase web config:

```html
<script>
  window.FIREBASE_CONFIG = {
    apiKey: "YOUR_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
  };
</script>
```

## Firestore
Collection: `posts`
Example document fields (recommended):
```
title: string
description: string
body: string (or bodyHtml: string for rich HTML)
imageUrl: string
category: string (e.g., "Reviews", "Trailers", "News")
author: string
createdAt: Timestamp or ISO string
views: number
```

## Rules (public read / protected write)
Use this to allow everyone to read, but only authenticated users with a custom claim `isAdmin = true` can write:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{docId} {
      allow read: if true;
      allow write: if request.auth.token.isAdmin == true;
    }
  }
}
```

If you don't use custom claims yet, for quick testing:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{docId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Notes
- Clicking a news card or a Trending item opens `post.html?id=<docId>`.
- If `createdAt` is a Firestore `Timestamp`, it will be formatted safely. ISO strings also work.
- If `views` cannot be incremented due to rules, the page will still render fine.
- Add a `fallback.jpg` in your web root to show when a post has no image.
