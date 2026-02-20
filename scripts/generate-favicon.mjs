import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { deflateSync } from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

// Colors
function lerp(a, b, t) { return Math.round(a + (b - a) * t); }

function getGradientColor(x, y, size) {
  const t = (x + y) / (2 * (size - 1));
  // Purple #7c3aed to Rose #f43f5e
  return {
    r: lerp(0x7c, 0xf4, t),
    g: lerp(0x3a, 0x3f, t),
    b: lerp(0xed, 0x5e, t),
    a: 255,
  };
}

// "C" letter - uses normalized coordinates so it works at any size
function isCPixel(x, y, size) {
  const nx = x / size;
  const ny = y / size;

  // Center and radii of the C arc
  const cx = 0.50, cy = 0.50;
  const outerR = 0.28;
  const innerR = 0.165;

  const dx = nx - cx;
  const dy = ny - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Must be within the ring (between inner and outer radius)
  if (dist > outerR || dist < innerR) return false;

  // Cut out the opening on the right side (gap for the C shape)
  // Open from about -40 to +40 degrees on the right
  const angle = Math.atan2(dy, dx);
  if (angle > -0.70 && angle < 0.70) return false;

  // Add top and bottom horizontal arms to make a crisp C
  const armH = 0.115; // arm thickness
  const armLeft = 0.48, armRight = 0.62;

  // Top arm
  if (nx >= armLeft && nx <= armRight && ny >= cy - outerR && ny < cy - outerR + armH) return true;
  // Bottom arm
  if (nx >= armLeft && nx <= armRight && ny <= cy + outerR && ny > cy + outerR - armH) return true;

  return true;
}

// Round corners check
function isInRoundedRect(x, y, size, radius) {
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

// Generate PNG at a given size
function generatePNG(size) {
  const radius = Math.round(size * 0.1875); // ~6/32 ratio
  const pixels = Buffer.alloc(size * size * 4);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const offset = (y * size + x) * 4;
      if (!isInRoundedRect(x, y, size, radius)) {
        pixels[offset] = 0;
        pixels[offset + 1] = 0;
        pixels[offset + 2] = 0;
        pixels[offset + 3] = 0;
      } else if (isCPixel(x, y, size)) {
        pixels[offset] = 255;
        pixels[offset + 1] = 255;
        pixels[offset + 2] = 255;
        pixels[offset + 3] = 255;
      } else {
        const c = getGradientColor(x, y, size);
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

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 6;  // color type (RGBA)
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const rawData = Buffer.alloc(size * (1 + size * 4));
  for (let y = 0; y < size; y++) {
    rawData[y * (1 + size * 4)] = 0;
    pixels.copy(rawData, y * (1 + size * 4) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const compressed = deflateSync(rawData);

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// Generate all icon sizes
const icons = [
  { name: 'favicon.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

for (const { name, size } of icons) {
  const png = generatePNG(size);
  writeFileSync(join(publicDir, name), png);
  console.log(`Generated ${name} (${size}x${size}, ${png.length} bytes)`);
}

// Create ICO from 32x32 PNG
const png32 = generatePNG(32);
const icoHeader = Buffer.alloc(6);
icoHeader.writeUInt16LE(0, 0);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(1, 4);

const icoEntry = Buffer.alloc(16);
icoEntry[0] = 32;
icoEntry[1] = 32;
icoEntry[2] = 0;
icoEntry[3] = 0;
icoEntry.writeUInt16LE(1, 4);
icoEntry.writeUInt16LE(32, 6);
icoEntry.writeUInt32LE(png32.length, 8);
icoEntry.writeUInt32LE(22, 12);

const ico = Buffer.concat([icoHeader, icoEntry, png32]);
writeFileSync(join(publicDir, 'favicon.ico'), ico);
console.log(`Generated favicon.ico (${ico.length} bytes)`);

console.log('\nAll icons generated for all devices!');
