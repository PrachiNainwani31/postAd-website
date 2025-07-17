// controllers/adController.js
import Ad from '../models/Ad.js';
import path from 'path';
import fs from 'fs';

export const postAd = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    console.log("Received files:", req.files);

    const { title, description, price, location, category, user } = req.body;

    let images = [];
    if (req.files?.images) {
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (let file of files) {
        const dir = 'uploads';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);

        const filename = `${Date.now()}_${file.name}`;
        const uploadPath = path.join(dir, filename);
        await file.mv(uploadPath);
        images.push(`uploads/${filename}`);
      }
    }

    const newAd = await Ad.create({ title, description, price, location, category, images, user });
    res.json({ success: true, ad: newAd });
  } catch (err) {
    console.error("POST /api/ads/post ERROR:", err);
    res.status(500).json({ error: 'Error posting ad', details: err.message });
  }


};

export const getAdById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate('user', 'name email');
    res.json(ad);
  } catch (err) {
    res.status(404).json({ error: 'Ad not found' });
  }
};

export const getAllAds = async (req, res) => {
  const ads = await Ad.find().populate('user', 'name');
  res.json(ads);
};

export const getUserAds = async (req, res) => {
  try {
    const userAds = await Ad.find({ user: req.params.id });
    res.json(userAds);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAd = async (req, res) => {
  try {
    const { id } = req.params;
    await Ad.findByIdAndDelete(id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};

export const updateAd = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, location } = req.body;
    const update = { title, description, price, category, location };

    if (req.files?.images) {
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      const images = [];
      files.forEach(file => {
        const uploadsDir = path.join('uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
        const filename = `${Date.now()}_${file.name}`;
        const uploadPath = path.join(uploadsDir, filename);
        file.mv(uploadPath);
        images.push(`uploads/${filename}`);
      });
      update.images = images;
    }

    const ad = await Ad.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, ad });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Update failed' });
  }
};
