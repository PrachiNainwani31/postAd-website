import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Ad from './models/Ad.js';

dotenv.config();

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const OLD = 'http://localhost:5001';
  const NEW = process.env.BASE_URL; // e.g. https://postad-...railway.app

  const ads = await Ad.find({});
  for (const ad of ads) {
    let modified = false;
    ad.images = ad.images.map(img => {
      if (img.startsWith(OLD)) {
        modified = true;
        return img.replace(OLD, NEW);
      }
      return img;
    });
    if (modified) await ad.save();
  }
  console.log('Image URLs updated!');
  mongoose.disconnect();
})();
