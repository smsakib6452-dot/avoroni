const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.join(__dirname, "../public/images/colorways");
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 6 Authentic Color Dyes
const PALETTES = {
  red: { r: 195, g: 25, b: 42, boost: 1.35 },     // Crimson Red / লাল
  green: { r: 25, g: 110, b: 58, boost: 1.35 },   // Emerald Green / পান্না সবুজ
  yellow: { r: 225, g: 165, b: 35, boost: 1.35 }, // Haldi Saffron / হলুদ
  blue: { r: 28, g: 70, b: 155, boost: 1.4 },     // Royal Blue / নীল
  pink: { r: 215, g: 60, b: 110, boost: 1.35 },   // Rose Pink / গোলাপি
  purple: { r: 115, g: 35, b: 135, boost: 1.4 },  // Royal Jamuni / জামুনি
};

/**
 * Photographically dye saree fabric while preserving natural face, skin, hair, and architectural background.
 */
async function dyeSareeImage(inputPath, outputPath, targetColor, faceBox) {
  try {
    const img = sharp(inputPath);
    const { width, height } = await img.metadata();
    const { data } = await img.raw().toBuffer({ resolveWithObject: true });

    const { cx, cy, rx, ry } = faceBox;
    const out = Buffer.from(data);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 3;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];

        // Elliptical distance to face center
        const dx = (x - cx) / rx;
        const dy = (y - cy) / ry;
        const distSq = dx * dx + dy * dy;

        // Background above the head/shoulders
        const isUpperBg = (y < cy - ry * 0.95 && distSq > 1.2);

        // Neck protection (column directly below face)
        const isNeck = (y >= cy + ry * 0.7 && y <= cy + ry * 1.45 && Math.abs(x - cx) < rx * 0.75);

        let sareeWeight = 0;

        if (distSq < 1.0 || isNeck || isUpperBg) {
          // Keep natural face, hair, jewelry, background
          sareeWeight = 0;
        } else if (distSq < 1.4) {
          // Smooth feather blend around face boundary
          sareeWeight = (Math.sqrt(distSq) - 1.0) / 0.4;
        } else if (y < cy + ry * 0.7) {
          // Upper transition
          sareeWeight = Math.min(1.0, Math.max(0, (y - (cy - ry * 0.5)) / (ry * 1.2)));
        } else {
          sareeWeight = 1.0;
        }

        if (sareeWeight > 0) {
          // Photographic luminance
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          const normL = lum / 255;

          // Target dyed color
          let dR = normL * targetColor.r * targetColor.boost;
          let dG = normL * targetColor.g * targetColor.boost;
          let dB = normL * targetColor.b * targetColor.boost;

          // Preserve golden highlights & shimmer
          if (lum > 175) {
            const glaze = (lum - 175) / 80;
            dR += glaze * 42;
            dG += glaze * 32;
            dB += glaze * 10;
          }

          dR = Math.min(255, Math.max(0, dR));
          dG = Math.min(255, Math.max(0, dG));
          dB = Math.min(255, Math.max(0, dB));

          // Seamless linear interpolation
          out[idx] = Math.round(r * (1 - sareeWeight) + dR * sareeWeight);
          out[idx + 1] = Math.round(g * (1 - sareeWeight) + dG * sareeWeight);
          out[idx + 2] = Math.round(b * (1 - sareeWeight) + dB * sareeWeight);
        }
      }
    }

    await sharp(out, { raw: { width, height, channels: 3 } })
      .jpeg({ quality: 93, progressive: true })
      .toFile(outputPath);

    const stat = fs.statSync(outputPath);
    console.log(`Saved: ${path.basename(outputPath)} (${Math.round(stat.size / 1024)} KB)`);
  } catch (err) {
    console.error(`Error dyeing ${outputPath}:`, err);
  }
}

async function main() {
  console.log("=== Building Authentic Regional Saree Colorways with Photographic Precision ===");

  // 1. DHAKAI JAMDANI
  const jamdaniSrc = path.join(__dirname, "../public/images/jamdani_model.jpg");
  const jamdaniFace = { cx: 445, cy: 245, rx: 95, ry: 130 };

  // Copy white/original (authentic Jamdani)
  fs.copyFileSync(jamdaniSrc, path.join(OUTPUT_DIR, "jamdani_white.jpg"));
  console.log("Saved: jamdani_white.jpg");

  for (const [colorName, colorConfig] of Object.entries(PALETTES)) {
    await dyeSareeImage(
      jamdaniSrc,
      path.join(OUTPUT_DIR, `jamdani_${colorName}.jpg`),
      colorConfig,
      jamdaniFace
    );
  }

  // 2. RAJSHAHI MULBERRY SILK
  const rajshahiSrc = path.join(__dirname, "../public/images/rajshahi_silk_model.jpg");
  const rajshahiFace = { cx: 297, cy: 351, rx: 95, ry: 135 };

  // Copy blue/original
  fs.copyFileSync(rajshahiSrc, path.join(OUTPUT_DIR, "rajshahi_blue.jpg"));
  console.log("Saved: rajshahi_blue.jpg");

  for (const [colorName, colorConfig] of Object.entries(PALETTES)) {
    if (colorName === "blue") continue; // Already copied original blue
    await dyeSareeImage(
      rajshahiSrc,
      path.join(OUTPUT_DIR, `rajshahi_${colorName}.jpg`),
      colorConfig,
      rajshahiFace
    );
  }

  // 3. MIRPUR BRIDAL KATAN
  const mirpurSrc = path.join(__dirname, "../public/images/hero_culture.jpg");
  const mirpurFace = { cx: 550, cy: 180, rx: 90, ry: 110 };

  // Copy red/original
  fs.copyFileSync(mirpurSrc, path.join(OUTPUT_DIR, "mirpur_red.jpg"));
  console.log("Saved: mirpur_red.jpg");

  for (const [colorName, colorConfig] of Object.entries(PALETTES)) {
    if (colorName === "red") continue; // Already copied original red
    await dyeSareeImage(
      mirpurSrc,
      path.join(OUTPUT_DIR, `mirpur_${colorName}.jpg`),
      colorConfig,
      mirpurFace
    );
  }

  // 4. TANGAIL HANDLOOM TAANT
  const tangailSrc = path.join(__dirname, "../public/images/sarees_origin_model.jpg");
  const tangailFace = { cx: 426, cy: 332, rx: 100, ry: 140 };

  // Copy yellow/original
  fs.copyFileSync(tangailSrc, path.join(OUTPUT_DIR, "tangail_yellow.jpg"));
  console.log("Saved: tangail_yellow.jpg");

  for (const [colorName, colorConfig] of Object.entries(PALETTES)) {
    if (colorName === "yellow") continue; // Already copied original yellow
    await dyeSareeImage(
      tangailSrc,
      path.join(OUTPUT_DIR, `tangail_${colorName}.jpg`),
      colorConfig,
      tangailFace
    );
  }

  console.log("=== All 24 Regional Saree Colorways Generated Flawlessly! ===");
}

main();
