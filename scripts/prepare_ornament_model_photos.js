const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function processModelImages() {
  const baseDir = path.join(__dirname, '../public/images');
  const lifestyleDir = path.join(baseDir, 'lifestyle');

  // 1. Kundan Choker Model: Crop from editorial_portrait.jpg focusing on upper body, neck choker & face
  // editorial_portrait.jpg is 896 x 1200
  await sharp(path.join(baseDir, 'editorial_portrait.jpg'))
    .extract({ left: 160, top: 100, width: 700, height: 875 })
    .resize(800, 1000, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(lifestyleDir, 'jewel_kundan_choker_model.jpg'));
  console.log('Created jewel_kundan_choker_model.jpg');

  // 2. Chandbali & Polki Jhumka Model: Crop from contact_intro.jpg focusing on upper body & earrings
  // contact_intro.jpg is 896 x 1200
  await sharp(path.join(baseDir, 'contact_intro.jpg'))
    .extract({ left: 180, top: 120, width: 680, height: 850 })
    .resize(800, 1000, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(lifestyleDir, 'jewel_chandbali_jhumka_model.jpg'));
  console.log('Created jewel_chandbali_jhumka_model.jpg');

  // 3. Meenakari Bangles Model: Crop from contact_friends.jpg or editorial_large.jpg
  // In contact_friends.jpg (1200x896 or similar), let's check dimensions or use editorial_portrait.jpg with bangle emphasis
  const friendsMeta = await sharp(path.join(baseDir, 'contact_friends.jpg')).metadata();
  console.log('contact_friends dimensions:', friendsMeta.width, friendsMeta.height);

  // In contact_friends, the woman on the right has intricate bangles stack and green silk saree
  // Let's crop to focus on the bride and her bangles
  await sharp(path.join(baseDir, 'contact_friends.jpg'))
    .extract({ left: 350, top: 120, width: 550, height: 687 })
    .resize(800, 1000, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(lifestyleDir, 'jewel_meenakari_bangles_model.jpg'));
  console.log('Created jewel_meenakari_bangles_model.jpg');

  // 4. Chandrahaar Model: From jewelry_cover.jpg (which is already 800 x 1000 showing bride wearing royal chandrahaar)
  await sharp(path.join(lifestyleDir, 'jewelry_cover.jpg'))
    .resize(800, 1000, { fit: 'cover' })
    .jpeg({ quality: 95 })
    .toFile(path.join(lifestyleDir, 'jewel_chandrahaar_pendant_model.jpg'));
  console.log('Created jewel_chandrahaar_pendant_model.jpg');

  console.log('All 4 model images generated successfully!');
}

processModelImages().catch(err => {
  console.error('Error generating model images:', err);
  process.exit(1);
});
