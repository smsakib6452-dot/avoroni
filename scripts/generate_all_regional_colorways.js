const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, '../public/images/colorways');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), s, l];
}

function hslToRgb(h, s, l) {
  h = (h % 360 + 360) % 360;
  h /= 360;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * High-precision fabric recoloring function
 */
async function recolorSaree({
  inputPath,
  outputPath,
  targetHue,
  targetSat = 1.0,
  targetLum = 1.0,
  isFabricPixel,
}) {
  const img = sharp(inputPath);
  const { width, height } = await img.metadata();
  const { data } = await img.raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.from(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 3;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const [h, s, l] = rgbToHsl(r, g, b);
      const weight = isFabricPixel(x, y, r, g, b, h, s, l, width, height);

      if (weight > 0.01) {
        const newSat = Math.min(1.0, Math.max(0.1, s * targetSat));
        const newLum = Math.min(1.0, Math.max(0.05, l * targetLum));
        const [nR, nG, nB] = hslToRgb(targetHue, newSat, newLum);

        out[idx] = Math.round(r * (1 - weight) + nR * weight);
        out[idx + 1] = Math.round(g * (1 - weight) + nG * weight);
        out[idx + 2] = Math.round(b * (1 - weight) + nB * weight);
      }
    }
  }

  await sharp(out, { raw: { width, height, channels: 3 } })
    .jpeg({ quality: 94, progressive: true })
    .toFile(outputPath);

  const stat = fs.statSync(outputPath);
  console.log(`Generated: ${path.basename(outputPath)} (${Math.round(stat.size / 1024)} KB)`);
}

async function main() {
  console.log('=== Generating All Regional Saree Colorways with Photographic Precision ===\n');

  // ==========================================
  // 1. MIRPUR BRIDAL KATAN (Base: mirpur_red.jpg)
  // ==========================================
  console.log('--- 1. Mirpur Bridal Katan ---');
  const mirpurSrc = path.join(OUTPUT_DIR, 'mirpur_red.jpg');

  const mirpurFabricDetector = (x, y, r, g, b, h, s, l) => {
    // Model bounds
    if (x < 265 || x > 880 || y < 255 || y > 1020) return 0;

    // Face protection
    const fdx = (x - 415) / 55;
    const fdy = (y - 305) / 65;
    if (fdx * fdx + fdy * fdy < 1.0) return 0;

    // Peacock feather protection
    if (x >= 450 && x <= 560 && y >= 415 && y <= 550) {
      if (h >= 45 && h <= 250) return 0;
    }

    // Red fabric detection
    const isRedDominant = (r > g + 28) && (r > b + 28) && (h >= 335 || h <= 25);
    const isSkin = (g > 75 && b > 65) || (g > 110) || (h >= 15 && h <= 35 && s < 0.60);
    const isStone = (b > 85) || (s < 0.25);
    const isGoldZari = (g / r > 0.48 && l > 0.35 && h > 28);

    if (isRedDominant && !isSkin && !isStone && !isGoldZari) {
      return 1.0;
    }
    return 0;
  };

  await recolorSaree({
    inputPath: mirpurSrc,
    outputPath: path.join(OUTPUT_DIR, 'mirpur_green.jpg'),
    targetHue: 155, targetSat: 1.0, targetLum: 0.90,
    isFabricPixel: mirpurFabricDetector,
  });
  await recolorSaree({
    inputPath: mirpurSrc,
    outputPath: path.join(OUTPUT_DIR, 'mirpur_yellow.jpg'),
    targetHue: 44, targetSat: 1.15, targetLum: 1.10,
    isFabricPixel: mirpurFabricDetector,
  });
  await recolorSaree({
    inputPath: mirpurSrc,
    outputPath: path.join(OUTPUT_DIR, 'mirpur_blue.jpg'),
    targetHue: 216, targetSat: 1.05, targetLum: 0.90,
    isFabricPixel: mirpurFabricDetector,
  });
  await recolorSaree({
    inputPath: mirpurSrc,
    outputPath: path.join(OUTPUT_DIR, 'mirpur_pink.jpg'),
    targetHue: 330, targetSat: 1.05, targetLum: 1.02,
    isFabricPixel: mirpurFabricDetector,
  });
  await recolorSaree({
    inputPath: mirpurSrc,
    outputPath: path.join(OUTPUT_DIR, 'mirpur_purple.jpg'),
    targetHue: 282, targetSat: 1.0, targetLum: 0.88,
    isFabricPixel: mirpurFabricDetector,
  });

  // ==========================================
  // 2. TANGAIL SILK TAANT (Base: sarees_origin_model.jpg)
  // ==========================================
  console.log('\n--- 2. Tangail Silk Taant ---');
  const tangailSrc = path.join(__dirname, '../public/images/sarees_origin_model.jpg');
  fs.copyFileSync(tangailSrc, path.join(OUTPUT_DIR, 'tangail_yellow.jpg'));
  console.log('Saved: tangail_yellow.jpg (Original Yellow Base)');

  const tangailFabricDetector = (x, y, r, g, b, h, s, l) => {
    // Model bounds
    if (y < 260 || y > 1150 || x < 150 || x > 750) return 0;

    // Face & neck protection
    const fdx = (x - 399) / 80;
    const fdy = (y - 292) / 100;
    if (fdx * fdx + fdy * fdy < 1.0) return 0;

    // Neck & chest skin protection
    if (x >= 350 && x <= 450 && y >= 340 && y <= 450) {
      if (s < 0.40 && l > 0.40) return 0;
    }

    // Hands protection
    if (y >= 500 && y <= 720 && x >= 320 && x <= 500) {
      if (h >= 15 && h <= 35 && s < 0.50 && l > 0.45) return 0;
    }

    // Saree fabric is warm cream / soft yellow / orange-gold
    const isTangailFabric = (h >= 15 && h <= 55) && (s > 0.22) && (l > 0.20 && l < 0.88);
    const isNeutralBg = (Math.abs(r - g) < 12 && Math.abs(g - b) < 12);

    if (isTangailFabric && !isNeutralBg) {
      return 1.0;
    }
    return 0;
  };

  await recolorSaree({
    inputPath: tangailSrc,
    outputPath: path.join(OUTPUT_DIR, 'tangail_red.jpg'),
    targetHue: 350, targetSat: 1.15, targetLum: 0.88,
    isFabricPixel: tangailFabricDetector,
  });
  await recolorSaree({
    inputPath: tangailSrc,
    outputPath: path.join(OUTPUT_DIR, 'tangail_green.jpg'),
    targetHue: 155, targetSat: 1.10, targetLum: 0.85,
    isFabricPixel: tangailFabricDetector,
  });
  await recolorSaree({
    inputPath: tangailSrc,
    outputPath: path.join(OUTPUT_DIR, 'tangail_blue.jpg'),
    targetHue: 215, targetSat: 1.15, targetLum: 0.85,
    isFabricPixel: tangailFabricDetector,
  });
  await recolorSaree({
    inputPath: tangailSrc,
    outputPath: path.join(OUTPUT_DIR, 'tangail_pink.jpg'),
    targetHue: 332, targetSat: 1.10, targetLum: 0.95,
    isFabricPixel: tangailFabricDetector,
  });
  await recolorSaree({
    inputPath: tangailSrc,
    outputPath: path.join(OUTPUT_DIR, 'tangail_purple.jpg'),
    targetHue: 280, targetSat: 1.10, targetLum: 0.82,
    isFabricPixel: tangailFabricDetector,
  });

  // ==========================================
  // 3. KASHI BANARASI SILK (Base: editorial_large.jpg)
  // ==========================================
  console.log('\n--- 3. Kashi Banarasi Silk ---');
  const banarasSrc = path.join(__dirname, '../public/images/editorial_large.jpg');
  fs.copyFileSync(banarasSrc, path.join(OUTPUT_DIR, 'banaras_red.jpg'));
  console.log('Saved: banaras_red.jpg (Original Kadwa Red Silk Base)');

  const banarasFabricDetector = (x, y, r, g, b, h, s, l) => {
    // Model bounds
    if (y < 280 || y > 1150 || x < 150 || x > 780) return 0;

    // Face & neck protection
    const fdx = (x - 404) / 70;
    const fdy = (y - 374) / 95;
    if (fdx * fdx + fdy * fdy < 1.0) return 0;

    // Background pillar / wall protection (grey/brown/stone)
    if (x < 220 || x > 720) {
      if (s < 0.25) return 0;
    }

    // Red fabric detection
    const isRedHue = (h >= 340 || h <= 22);
    const isRedSaree = isRedHue && (s > 0.30) && (r - g > 30) && (r - b > 30);
    const isGoldZari = (h >= 30 && h <= 60) || (g / r > 0.52 && l > 0.38);

    if (isRedSaree && !isGoldZari) {
      return 1.0;
    }
    return 0;
  };

  await recolorSaree({
    inputPath: banarasSrc,
    outputPath: path.join(OUTPUT_DIR, 'banaras_green.jpg'),
    targetHue: 155, targetSat: 1.05, targetLum: 0.88,
    isFabricPixel: banarasFabricDetector,
  });
  await recolorSaree({
    inputPath: banarasSrc,
    outputPath: path.join(OUTPUT_DIR, 'banaras_yellow.jpg'),
    targetHue: 44, targetSat: 1.15, targetLum: 1.08,
    isFabricPixel: banarasFabricDetector,
  });
  await recolorSaree({
    inputPath: banarasSrc,
    outputPath: path.join(OUTPUT_DIR, 'banaras_blue.jpg'),
    targetHue: 215, targetSat: 1.10, targetLum: 0.88,
    isFabricPixel: banarasFabricDetector,
  });
  await recolorSaree({
    inputPath: banarasSrc,
    outputPath: path.join(OUTPUT_DIR, 'banaras_pink.jpg'),
    targetHue: 330, targetSat: 1.10, targetLum: 0.98,
    isFabricPixel: banarasFabricDetector,
  });
  await recolorSaree({
    inputPath: banarasSrc,
    outputPath: path.join(OUTPUT_DIR, 'banaras_purple.jpg'),
    targetHue: 282, targetSat: 1.05, targetLum: 0.85,
    isFabricPixel: banarasFabricDetector,
  });

  // ==========================================
  // 4. KANCHIPURAM TEMPLE TWILL (Base: editorial_portrait.jpg)
  // ==========================================
  console.log('\n--- 4. Kanchipuram Temple Twill ---');
  const kanchipuramSrc = path.join(__dirname, '../public/images/editorial_portrait.jpg');
  fs.copyFileSync(kanchipuramSrc, path.join(OUTPUT_DIR, 'kanchipuram_green.jpg'));
  console.log('Saved: kanchipuram_green.jpg (Original Peacock Emerald Base)');

  const kanchipuramFabricDetector = (x, y, r, g, b, h, s, l) => {
    // Model bounds
    if (y < 250 || y > 1150 || x < 180 || x > 780) return 0;

    // Face & neck protection
    const fdx = (x - 479) / 75;
    const fdy = (y - 306) / 95;
    if (fdx * fdx + fdy * fdy < 1.0) return 0;

    // Neck & jewelry protection
    if (x >= 420 && x <= 540 && y >= 370 && y <= 450) {
      if (s < 0.40 || l > 0.45) return 0;
    }

    // Emerald green silk fabric detection (hues around 75 to 175) or dark rich greens
    const isGreenFabric = (h >= 65 && h <= 175) && (s > 0.18) && (g > b - 10) && (l > 0.12 && l < 0.85);
    const isGoldBorder = (h >= 30 && h <= 60) && (l > 0.35);

    if (isGreenFabric && !isGoldBorder) {
      return 1.0;
    }
    return 0;
  };

  await recolorSaree({
    inputPath: kanchipuramSrc,
    outputPath: path.join(OUTPUT_DIR, 'kanchipuram_red.jpg'),
    targetHue: 352, targetSat: 1.20, targetLum: 1.02,
    isFabricPixel: kanchipuramFabricDetector,
  });
  await recolorSaree({
    inputPath: kanchipuramSrc,
    outputPath: path.join(OUTPUT_DIR, 'kanchipuram_yellow.jpg'),
    targetHue: 44, targetSat: 1.20, targetLum: 1.15,
    isFabricPixel: kanchipuramFabricDetector,
  });
  await recolorSaree({
    inputPath: kanchipuramSrc,
    outputPath: path.join(OUTPUT_DIR, 'kanchipuram_blue.jpg'),
    targetHue: 215, targetSat: 1.20, targetLum: 0.95,
    isFabricPixel: kanchipuramFabricDetector,
  });
  await recolorSaree({
    inputPath: kanchipuramSrc,
    outputPath: path.join(OUTPUT_DIR, 'kanchipuram_pink.jpg'),
    targetHue: 332, targetSat: 1.15, targetLum: 1.05,
    isFabricPixel: kanchipuramFabricDetector,
  });
  await recolorSaree({
    inputPath: kanchipuramSrc,
    outputPath: path.join(OUTPUT_DIR, 'kanchipuram_purple.jpg'),
    targetHue: 280, targetSat: 1.15, targetLum: 0.92,
    isFabricPixel: kanchipuramFabricDetector,
  });

  // ==========================================
  // 5. CHANDERI SHEER TISSUE (Base: contact_intro.jpg)
  // ==========================================
  console.log('\n--- 5. Chanderi Sheer Tissue ---');
  const chanderiSrc = path.join(__dirname, '../public/images/contact_intro.jpg');
  fs.copyFileSync(chanderiSrc, path.join(OUTPUT_DIR, 'chanderi_yellow.jpg'));
  console.log('Saved: chanderi_yellow.jpg (Original Amber Sheer Base)');

  const chanderiFabricDetector = (x, y, r, g, b, h, s, l) => {
    // Model bounds
    if (y < 260 || y > 1150 || x < 150 || x > 760) return 0;

    // Face & neck protection
    const fdx = (x - 436) / 75;
    const fdy = (y - 281) / 95;
    if (fdx * fdx + fdy * fdy < 1.0) return 0;

    // Hands protection
    if (y >= 520 && y <= 750 && x >= 350 && x <= 520) {
      if (h >= 15 && h <= 35 && s < 0.50) return 0;
    }

    // Fabric is warm golden amber tissue
    const isTissueFabric = (h >= 18 && h <= 55) && (s > 0.22) && (l > 0.20 && l < 0.88);
    const isNeutralBg = (Math.abs(r - g) < 12 && Math.abs(g - b) < 12);

    if (isTissueFabric && !isNeutralBg) {
      return 1.0;
    }
    return 0;
  };

  await recolorSaree({
    inputPath: chanderiSrc,
    outputPath: path.join(OUTPUT_DIR, 'chanderi_red.jpg'),
    targetHue: 350, targetSat: 1.15, targetLum: 0.88,
    isFabricPixel: chanderiFabricDetector,
  });
  await recolorSaree({
    inputPath: chanderiSrc,
    outputPath: path.join(OUTPUT_DIR, 'chanderi_green.jpg'),
    targetHue: 155, targetSat: 1.10, targetLum: 0.85,
    isFabricPixel: chanderiFabricDetector,
  });
  await recolorSaree({
    inputPath: chanderiSrc,
    outputPath: path.join(OUTPUT_DIR, 'chanderi_blue.jpg'),
    targetHue: 215, targetSat: 1.15, targetLum: 0.85,
    isFabricPixel: chanderiFabricDetector,
  });
  await recolorSaree({
    inputPath: chanderiSrc,
    outputPath: path.join(OUTPUT_DIR, 'chanderi_pink.jpg'),
    targetHue: 332, targetSat: 1.10, targetLum: 0.95,
    isFabricPixel: chanderiFabricDetector,
  });
  await recolorSaree({
    inputPath: chanderiSrc,
    outputPath: path.join(OUTPUT_DIR, 'chanderi_purple.jpg'),
    targetHue: 280, targetSat: 1.10, targetLum: 0.82,
    isFabricPixel: chanderiFabricDetector,
  });

  console.log('\n=== All Regional Saree Colorways Generated Successfully! ===');
}

main().catch(err => {
  console.error('Fatal error generating colorways:', err);
  process.exit(1);
});
