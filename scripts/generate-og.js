import { deflateSync } from 'node:zlib';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const width = 1200;
const height = 630;

function crc(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i];
    for (let bit = 0; bit < 8; bit += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type), data]);
  const sum = Buffer.alloc(4);
  sum.writeUInt32BE(crc(body));
  return Buffer.concat([length, body, sum]);
}

const pixels = Buffer.alloc(width * height * 3);
function fill(r, g, b) {
  for (let i = 0; i < pixels.length; i += 3) {
    pixels[i] = r;
    pixels[i + 1] = g;
    pixels[i + 2] = b;
  }
}
function rect(x, y, w, h, r, g, b) {
  const x0 = Math.max(0, x);
  const y0 = Math.max(0, y);
  const x1 = Math.min(width, x + w);
  const y1 = Math.min(height, y + h);
  for (let yy = y0; yy < y1; yy += 1) {
    for (let xx = x0; xx < x1; xx += 1) {
      const i = (yy * width + xx) * 3;
      pixels[i] = r;
      pixels[i + 1] = g;
      pixels[i + 2] = b;
    }
  }
}

const glyph = {
  H: ['10001', '10001', '11111', '10001', '10001', '10001', '10001'],
  3: ['11111', '00001', '01110', '00001', '00001', '00001', '11110'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
};

function text(value, x, y, scale, r, g, b) {
  let cursor = x;
  for (const char of value) {
    const rows = glyph[char];
    if (!rows) {
      cursor += 4 * scale;
      continue;
    }
    rows.forEach((row, rowIndex) => {
      [...row].forEach((bit, col) => {
        if (bit === '1') rect(cursor + col * scale, y + rowIndex * scale, scale, scale, r, g, b);
      });
    });
    cursor += 6 * scale;
  }
}

fill(243, 240, 232);
rect(0, 0, 460, height, 30, 61, 56);
rect(0, height - 18, 460, 18, 143, 61, 22);
text('H3D', 48, 250, 14, 243, 240, 232);
rect(520, 70, 600, 490, 255, 252, 247);
rect(560, 120, 520, 390, 30, 61, 56);
rect(620, 250, 250, 140, 143, 61, 22);
rect(900, 160, 120, 80, 30, 61, 56);

const raw = Buffer.alloc((width * 3 + 1) * height);
for (let y = 0; y < height; y += 1) {
  const start = y * (width * 3 + 1);
  raw[start] = 0;
  pixels.copy(raw, start + 1, y * width * 3, (y + 1) * width * 3);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(width, 0);
ihdr.writeUInt32BE(height, 4);
ihdr[8] = 8;
ihdr[9] = 2;
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw)),
  chunk('IEND', Buffer.alloc(0)),
]);
fs.writeFileSync(path.join(root, 'public', 'og.png'), png);
console.log('og.png kesz');
