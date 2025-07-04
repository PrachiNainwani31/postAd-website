import express from 'express';
import Ad from '../models/Ad.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

router.post('/post', async (req, res) => {
  try {
    const { title, description, price, location, userId,category } = req.body;
    let images = [];
    if (req.files?.images) {
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (let file of files) {
        const dir = 'uploads';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const filename = `${Date.now()}_${file.name}`;
const uploadPath = path.join(dir, filename);
await file.mv(uploadPath);
images.push(`uploads/${filename}`);

      }
    }
    const newAd = await Ad.create({ title, description, price, location,category, images, user: userId });
    res.json({ success: true, ad: newAd });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error posting ad' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate('user', 'name email');
    res.json(ad);
  } catch (err) {
    res.status(404).json({ error: 'Ad not found' });
  }
});

router.get('/', async (req, res) => {
  const ads = await Ad.find().populate('user', 'name');
  res.json(ads);
});

export default router;