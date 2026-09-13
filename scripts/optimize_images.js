const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Disable Sharp disk cache to avoid file locking on Windows
sharp.cache(false);

async function optimizeAll() {
  function getFiles(dir) {
    let results = [];
    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...getFiles(full));
      } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
        results.push({ path: full, size: fs.statSync(full).size });
      }
    });
    return results;
  }

  const files = getFiles('public/images').filter(f => f.size > 200 * 1024);
  console.log(`Found ${files.length} images > 200KB to optimize...`);

  let totalBefore = 0;
  let totalAfter = 0;
  let count = 0;

  for (const f of files) {
    totalBefore += f.size;
    const inputBuffer = fs.readFileSync(f.path);
    const meta = await sharp(inputBuffer).metadata();

    let pipeline = sharp(inputBuffer);
    if (meta.width > 1600 || meta.height > 1600) {
      pipeline = pipeline.resize(1600, 1600, { fit: 'inside', withoutEnlargement: true });
    }

    let buffer;
    if (meta.format === 'jpeg') {
      buffer = await pipeline.jpeg({ quality: 80, mozjpeg: true, progressive: true }).toBuffer();
    } else if (meta.format === 'png') {
      buffer = await pipeline.png({ quality: 80, compressionLevel: 9 }).toBuffer();
    } else {
      buffer = await pipeline.toBuffer();
    }

    if (buffer.length < f.size) {
      fs.writeFileSync(f.path, buffer);
      totalAfter += buffer.length;
      count++;
    } else {
      totalAfter += f.size;
    }
  }

  console.log(`Optimized ${count} images successfully!`);
  console.log(`Initial Size: ${(totalBefore / 1024 / 1024).toFixed(2)} MB`);
  console.log(`New Size: ${(totalAfter / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Total Reduction: ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%`);
}

optimizeAll().catch(err => {
  console.error('Optimization error:', err);
  process.exit(1);
});
