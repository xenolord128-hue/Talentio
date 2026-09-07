import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');
const iconsDir = path.join(publicDir, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const svgBuffer = fs.readFileSync(path.join(publicDir, 'logo.svg'));

async function generateIcons() {
  console.log('Generating PWA PNG icons from logo.svg...');
  
  // 192x192 standard icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(iconsDir, 'icon-192.png'));
    
  // 512x512 standard icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(iconsDir, 'icon-512.png'));

  // 180x180 Apple touch icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(iconsDir, 'apple-touch-icon.png'));

  // 512x512 maskable icon with safe zone padding
  await sharp(svgBuffer)
    .resize(410, 410)
    .extend({
      top: 51,
      bottom: 51,
      left: 51,
      right: 51,
      background: '#1A1633'
    })
    .png()
    .toFile(path.join(iconsDir, 'icon-maskable-512.png'));

  console.log('Successfully generated all PWA PNG icons!');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
