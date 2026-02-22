// Firestore REST API helpers — works in any environment (no SDK needed)
const PROJECT_ID = 'cinenovatv-1e11a';
const API_KEY = 'AIzaSyAgvgLwp59An0SU_NR-C3vA95HpFnYFPDA';
const BASE = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

function parseValue(val) {
  if (val.stringValue !== undefined) return val.stringValue;
  if (val.integerValue !== undefined) return Number(val.integerValue);
  if (val.doubleValue !== undefined) return val.doubleValue;
  if (val.booleanValue !== undefined) return val.booleanValue;
  if (val.nullValue !== undefined) return null;
  if (val.timestampValue !== undefined) return val.timestampValue;
  if (val.arrayValue) return (val.arrayValue.values || []).map(parseValue);
  if (val.mapValue) return parseFields(val.mapValue.fields || {});
  return null;
}

function parseFields(fields) {
  const obj = {};
  for (const [key, val] of Object.entries(fields)) {
    obj[key] = parseValue(val);
  }
  return obj;
}

function readingTime(html) {
  if (!html) return 1;
  const text = html.replace(/<[^>]*>/g, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function parseDoc(doc) {
  const fields = parseFields(doc.fields || {});
  const id = doc.name.split('/').pop();
  return {
    id,
    ...fields,
    createdAt: fields.createdAt || null,
    publishedAt: fields.publishedAt || null,
    updatedAt: fields.updatedAt || null,
    readingTime: readingTime(fields.content),
  };
}

async function runQuery(structuredQuery) {
  const res = await fetch(`${BASE}:runQuery?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ structuredQuery }),
  });
  const data = await res.json();
  return (data || []).filter(r => r.document).map(r => parseDoc(r.document));
}

export async function getPublishedPosts(limitCount = 10) {
  return runQuery({
    from: [{ collectionId: 'posts' }],
    where: {
      fieldFilter: {
        field: { fieldPath: 'status' },
        op: 'EQUAL',
        value: { stringValue: 'published' },
      },
    },
    orderBy: [{ field: { fieldPath: 'publishedAt' }, direction: 'DESCENDING' }],
    limit: limitCount,
  });
}

export async function getAllPublishedPosts() {
  return runQuery({
    from: [{ collectionId: 'posts' }],
    where: {
      fieldFilter: {
        field: { fieldPath: 'status' },
        op: 'EQUAL',
        value: { stringValue: 'published' },
      },
    },
    orderBy: [{ field: { fieldPath: 'publishedAt' }, direction: 'DESCENDING' }],
  });
}

export async function getPostBySlug(slug) {
  const results = await runQuery({
    from: [{ collectionId: 'posts' }],
    where: {
      fieldFilter: {
        field: { fieldPath: 'slug' },
        op: 'EQUAL',
        value: { stringValue: slug },
      },
    },
    limit: 1,
  });
  return results[0] || null;
}

export async function getAllPostSlugs() {
  const posts = await runQuery({
    from: [{ collectionId: 'posts' }],
    where: {
      fieldFilter: {
        field: { fieldPath: 'status' },
        op: 'EQUAL',
        value: { stringValue: 'published' },
      },
    },
  });
  return posts.map(p => ({ slug: p.slug, updatedAt: p.updatedAt || null }));
}
