import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { deflateSync } from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const sourceImage = join(publicDir, 'icon.png');

if (!existsSync(sourceImage)) {
  console.error('Error: public/icon.png not found.');
  console.error('Please save your icon image as public/icon.png first.');
  process.exit(1);
}

// Check if sharp is available, install if needed
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.log('Installing sharp for image processing...');
  execSync('npm install sharp --save-dev', { cwd: join(__dirname, '..'), stdio: 'inherit' });
  sharp = (await import('sharp')).default;
}

const sizes = [
  { name: 'favicon.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

console.log('Generating icons from public/icon.png...');

for (const { name, size } of sizes) {
  const output = join(publicDir, name);
  await sharp(sourceImage)
    .resize(size, size, { fit: 'cover' })
    .png()
    .toFile(output);
  console.log(`  ${name} (${size}x${size})`);
}

// Generate favicon.ico from 32x32 PNG
const png32 = readFileSync(join(publicDir, 'favicon.png'));

const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0);     // reserved
icoHeader.writeUInt16LE(1, 2);     // type: icon
icoHeader.writeUInt16LE(1, 4);     // count: 1 image

const icoEntry = Buffer.alloc(16);
icoEntry[0] = 32;                  // width
icoEntry[1] = 32;                  // height
icoEntry[2] = 0;                   // color palette
icoEntry[3] = 0;                   // reserved
icoEntry.writeUInt16LE(1, 4);      // color planes
icoEntry.writeUInt16LE(32, 6);     // bits per pixel
icoEntry.writeUInt32LE(png32.length, 8);  // image size
icoEntry.writeUInt32LE(22, 12);    // offset (6 + 16)

const ico = Buffer.concat([icoHeader, icoEntry, png32]);
writeFileSync(join(publicDir, 'favicon.ico'), ico);
console.log(`  favicon.ico (${ico.length} bytes)`);

// Generate SVG that references the PNG as a data URI (for crisp scaling)
const png64 = readFileSync(join(publicDir, 'icon-192.png')).toString('base64');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 192">
  <image href="data:image/png;base64,${png64}" width="192" height="192"/>
</svg>`;
writeFileSync(join(publicDir, 'favicon.svg'), svg);
console.log('  favicon.svg');

console.log('\nAll icons generated successfully!');
