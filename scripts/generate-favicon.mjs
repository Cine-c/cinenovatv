import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { deflateSync } from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SIZE = 32;

// Colors
function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

function getGradientColor(x, y) {
  const t = (x + y) / (2 * (SIZE - 1));
  // Purple #7c3aed to Rose #f43f5e
  return {
    r: lerp(0x7c, 0xf4, t),
    g: lerp(0x3a, 0x3f, t),
    b: lerp(0xed, 0x5e, t),
    a: 255,
  };
}

// Simple "N" letter bitmap (1 = white pixel, 0 = transparent)
// Designed for 32x32, the N spans roughly rows 6-25, cols 7-24
function isNPixel(x, y) {
  const left = 8, right = 23, top = 7, bottom = 25;
  const barW = 4;
  const diagW = 4;

  if (y < top || y > bottom) return false;

  // Left vertical bar
  if (x >= left && x < left + barW) return true;
  // Right vertical bar
  if (x > right - barW && x <= right) return true;
  // Diagonal from top-left to bottom-right
  const progress = (y - top) / (bottom - top);
  const diagCenter = left + barW / 2 + progress * (right - barW / 2 - left - barW / 2);
  if (Math.abs(x - diagCenter) < diagW / 2) return true;

  return false;
}

// Round corners check
function isInRoundedRect(x, y, size, radius) {
  // Check if point is inside rounded rect
  if (x < radius && y < radius) {
    return (x - radius) ** 2 + (y - radius) ** 2 <= radius ** 2;
  }
  if (x >= size - radius && y < radius) {
    return (x - (size - radius - 1)) ** 2 + (y - radius) ** 2 <= radius ** 2;
  }
  if (x < radius && y >= size - radius) {
    return (x - radius) ** 2 + (y - (size - radius - 1)) ** 2 <= radius ** 2;
  }
  if (x >= size - radius && y >= size - radius) {
    return (x - (size - radius - 1)) ** 2 + (y - (size - radius - 1)) ** 2 <= radius ** 2;
  }
  return true;
}

// Generate pixel data (RGBA)
const pixels = Buffer.alloc(SIZE * SIZE * 4);
const radius = 6;

for (let y = 0; y < SIZE; y++) {
  for (let x = 0; x < SIZE; x++) {
    const offset = (y * SIZE + x) * 4;
    if (!isInRoundedRect(x, y, SIZE, radius)) {
      // Transparent
      pixels[offset] = 0;
      pixels[offset + 1] = 0;
      pixels[offset + 2] = 0;
      pixels[offset + 3] = 0;
    } else if (isNPixel(x, y)) {
      // White N
      pixels[offset] = 255;
      pixels[offset + 1] = 255;
      pixels[offset + 2] = 255;
      pixels[offset + 3] = 255;
    } else {
      const c = getGradientColor(x, y);
      pixels[offset] = c.r;
      pixels[offset + 1] = c.g;
      pixels[offset + 2] = c.b;
      pixels[offset + 3] = c.a;
    }
  }
}

// Create PNG
function crc32(buf) {
  let crc = 0xffffffff;
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) {
    crc = table[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, 'ascii');
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData));
  return Buffer.concat([length, typeBuffer, data, crc]);
}

// IHDR
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0);  // width
ihdr.writeUInt32BE(SIZE, 4);  // height
ihdr[8] = 8;  // bit depth
ihdr[9] = 6;  // color type (RGBA)
ihdr[10] = 0; // compression
ihdr[11] = 0; // filter
ihdr[12] = 0; // interlace

// IDAT - raw pixel data with filter byte per row
const rawData = Buffer.alloc(SIZE * (1 + SIZE * 4));
for (let y = 0; y < SIZE; y++) {
  rawData[y * (1 + SIZE * 4)] = 0; // no filter
  pixels.copy(rawData, y * (1 + SIZE * 4) + 1, y * SIZE * 4, (y + 1) * SIZE * 4);
}
const compressed = deflateSync(rawData);

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
  pngChunk('IHDR', ihdr),
  pngChunk('IDAT', compressed),
  pngChunk('IEND', Buffer.alloc(0)),
]);

// Create ICO with embedded PNG
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0);     // reserved
icoHeader.writeUInt16LE(1, 2);     // type: icon
icoHeader.writeUInt16LE(1, 4);     // count: 1 image

const icoEntry = Buffer.alloc(16);
icoEntry[0] = SIZE;                // width
icoEntry[1] = SIZE;                // height
icoEntry[2] = 0;                   // color palette
icoEntry[3] = 0;                   // reserved
icoEntry.writeUInt16LE(1, 4);      // color planes
icoEntry.writeUInt16LE(32, 6);     // bits per pixel
icoEntry.writeUInt32LE(png.length, 8);  // image size
icoEntry.writeUInt32LE(22, 12);    // offset (6 + 16)

const ico = Buffer.concat([icoHeader, icoEntry, png]);

// Write files
const publicDir = join(__dirname, '..', 'public');
writeFileSync(join(publicDir, 'favicon.ico'), ico);
writeFileSync(join(publicDir, 'favicon.png'), png);

console.log(`Generated favicon.ico (${ico.length} bytes) and favicon.png (${png.length} bytes)`);
