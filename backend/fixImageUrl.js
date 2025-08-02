import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import fs from 'fs';
import path from 'path';
import Ad from './models/Ad.js'; 

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const migrateImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected for final migration...');

    const localUploadsPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(localUploadsPath)) {
      console.error(`Error: 'uploads' folder not found at ${localUploadsPath}`);
      return;
    }
    console.log(`Found local images folder: ${localUploadsPath}`);

    const adsToMigrate = await Ad.find({ "images": { $not: /^https:\/\// } });

    if (adsToMigrate.length === 0) {
      console.log('No ads with old URLs found. Nothing to migrate.');
      return;
    }

    console.log(`🔎 Found ${adsToMigrate.length} ads with old images to migrate.`);

    for (const ad of adsToMigrate) {
      const newImageUrls = [];
      let wasModified = false;

      for (const oldUrlOrPath of ad.images) {
        const filename = path.basename(oldUrlOrPath);
        const localFilePath = path.join(localUploadsPath, filename);

        if (fs.existsSync(localFilePath)) {
          console.log(`  Uploading ${filename} for ad "${ad.title}"...`);
          const result = await cloudinary.v2.uploader.upload(localFilePath, {
            folder: 'postad_uploads',
          });
          newImageUrls.push(result.secure_url);
          console.log(`    => Success: ${result.secure_url}`);
          wasModified = true;
        } else {
          console.warn(`    => Warning: Local file not found for ${filename}`);
          newImageUrls.push(oldUrlOrPath);
        }
      }

      if (wasModified) {
        ad.images = newImageUrls;
        await ad.save();
        console.log(`Database updated for ad: ${ad._id}`);
      }
    }

    console.log('\nFinal migration script finished successfully!');

  } catch (error) {
    console.error('An error occurred during migration:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected.');
  }
};

migrateImages();