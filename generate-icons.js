import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const input = path.join(__dirname, 'public/logo.svg');

async function generate() {
  await sharp(input).resize(192, 192).toFile(path.join(__dirname, 'public/pwa-192x192.png'));
  await sharp(input).resize(512, 512).toFile(path.join(__dirname, 'public/pwa-512x512.png'));
  await sharp(input).resize(180, 180).toFile(path.join(__dirname, 'public/apple-touch-icon.png'));
  console.log('Icons generated successfully.');
}
generate();
