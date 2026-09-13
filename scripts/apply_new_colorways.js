const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '../public/images/colorways');
const items = [
  'banaras_yellow',
  'banaras_blue',
  'banaras_pink',
  'banaras_purple',
  'kanchipuram_red',
  'kanchipuram_yellow',
  'kanchipuram_blue',
  'kanchipuram_pink',
  'kanchipuram_purple',
  'chanderi_red',
  'chanderi_green',
  'chanderi_blue',
  'chanderi_pink',
  'chanderi_purple'
];

async function processAll() {
  console.log('=== Moving and verifying all 14 images ===');
  let count = 0;
  for (const name of items) {
    const src = path.join(dir, name + '.jpg.jpg');
    const dest = path.join(dir, name + '.jpg');
    
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dest);
      fs.unlinkSync(src);
      const stat = fs.statSync(dest);
      const meta = await sharp(dest).metadata();
      console.log(`[SUCCESS] ${name}.jpg -> ${meta.width}x${meta.height} (${Math.round(stat.size / 1024)} KB)`);
      count++;
    } else {
      console.log(`[NOT FOUND] ${src}`);
    }
  }
  console.log(`\nProcessed ${count} of ${items.length} images successfully.`);
}

processAll().catch(console.error);
