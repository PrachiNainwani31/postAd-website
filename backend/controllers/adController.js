// controllers/adController.js
import Ad from '../models/Ad.js';
import path from 'path';
import fs from 'fs';

import mongoose from 'mongoose';

export const postAd = async (req, res) => {
  try {
     console.log("📥 POST /api/ads/post - Incoming FormData:");
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { title, description, price, location, category, user } = req.body;

    if (!title || !description || !price || !location || !category || !user) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let images = [];
if (req.files?.length > 0) {
  images = req.files.map(file => file.path.replace(/\\/g, '/')); // normalize path
}

    const newAd = await Ad.create({
      title,
      description,
      price,
      location,
      category,
      images,
      user: new mongoose.Types.ObjectId(user) // ✅ convert string to ObjectId
    });

    res.json({ success: true, ad: newAd });
  } catch (err) {
    console.error("POST ERROR:", err.message, err.stack);
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

// GET all approved ads for homepage
export const getAllAds = async (req, res) => {
  try {
    const ads = await Ad.find({ status: 'approved' })
      .populate('user', 'name');
    res.json(ads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch ads' });
  }
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
    let keepImages = req.body.keepImages || [];

    // Convert to array if only one image
    if (typeof keepImages === 'string') keepImages = [keepImages];

    const update = { title, description, price, category, location };

    // Append kept images
    let images = [...keepImages];

    // Upload new images if any
    if (req.files?.images) {
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const file of files) {
        const uploadsDir = path.join('uploads');
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
        const filename = `${Date.now()}_${file.name}`;
        const uploadPath = path.join(uploadsDir, filename);
        await file.mv(uploadPath);
        images.push(`uploads/${filename}`);
      }
    }

    update.images = images;

    const ad = await Ad.findByIdAndUpdate(id, update, { new: true });
    res.json({ success: true, ad });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ success: false, message: 'Update failed', error: err.message });
  }
};

