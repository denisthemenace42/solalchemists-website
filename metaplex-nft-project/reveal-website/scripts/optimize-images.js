const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.resolve(__dirname, '..', 'images');

async function convertToModernFormats(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;
  const base = filePath.slice(0, -ext.length);
  const webpPath = base + '.webp';
  const avifPath = base + '.avif';

  try {
    const img = sharp(filePath).rotate();
    if (!fs.existsSync(webpPath)) {
      await img.clone().webp({ quality: 80 }).toFile(webpPath);
      console.log('→ webp', path.basename(webpPath));
    }
    if (!fs.existsSync(avifPath)) {
      await img.clone().avif({ quality: 60 }).toFile(avifPath);
      console.log('→ avif', path.basename(avifPath));
    }
  } catch (e) {
    console.error('Failed optimizing', filePath, e.message);
  }
}

async function run() {
  const files = fs.readdirSync(imagesDir).map(f => path.join(imagesDir, f));
  for (const file of files) {
    await convertToModernFormats(file);
  }
}

run().catch(err => { console.error(err); process.exit(1); });


