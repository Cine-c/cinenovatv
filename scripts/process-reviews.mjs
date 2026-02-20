import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public', 'blockbuster');

const files = [
  { src: 'C:/Users/HP/Downloads/files_extracted/blog-crime-101.html', out: 'crime-101.html' },
  { src: 'C:/Users/HP/Downloads/files_extracted/blog-scream-7.html', out: 'scream-7.html' },
  { src: 'C:/Users/HP/Downloads/files_extracted/blog-wuthering-heights.html', out: 'wuthering-heights.html' },
  { src: 'C:/Users/HP/Downloads/files_extracted2/blog-goat.html', out: 'goat.html' },
  { src: 'C:/Users/HP/Downloads/files_extracted2/blog-how-to-make-a-killing.html', out: 'how-to-make-a-killing.html' },
];

const backButton = `
<a href="/blockbuster" style="
  position:fixed;top:16px;left:16px;z-index:9999;
  display:inline-flex;align-items:center;gap:6px;
  padding:8px 16px;
  background:rgba(0,0,0,0.7);backdrop-filter:blur(12px);
  color:#fff;font-family:sans-serif;font-size:13px;font-weight:500;
  text-decoration:none;border-radius:999px;border:1px solid rgba(255,255,255,0.1);
  transition:all 0.2s ease;
" onmouseover="this.style.background='rgba(139,92,246,0.8)'" onmouseout="this.style.background='rgba(0,0,0,0.7)'">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
  CineNovaTV
</a>`;

for (const { src, out } of files) {
  let html = readFileSync(src, 'utf-8');

  // Remove image placeholder badges (the "Add Hero Image Here" overlays)
  html = html.replace(/<div class="img-placeholder-badge">[\s\S]*?<\/div>/g, '');

  // Remove inline image slot divs (empty dashed-border placeholders)
  html = html.replace(/<div class="inline-image-slot">[\s\S]*?<\/div>/g, '');

  // Remove HTML comments about adding images
  html = html.replace(/<!--[\s\S]*?-->/g, '');

  // Add back button after <body> tag
  html = html.replace(/<body>/, `<body>\n${backButton}`);

  writeFileSync(join(publicDir, out), html);
  console.log(`Processed: ${out}`);
}

console.log('\nAll reviews processed!');
