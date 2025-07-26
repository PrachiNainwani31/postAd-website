import Ad from '../models/Ad.js';
import mongoose from 'mongoose';

// REMOVED: path, fs, and BASE_URL are no longer needed here.

export const postAd = async (req, res) => {
  try {
    const { title, description, price, location, category, user } = req.body;

    if (!title || !description || !price || !location || !category || !user) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let images = [];

    // CHANGED: Get the secure URL directly from file.path provided by Cloudinary
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path); 
    }

    const newAd = await Ad.create({
      title,
      description,
      price,
      location,
      category,
      images,
      user: new mongoose.Types.ObjectId(user),
    });

    res.json({ success: true, ad: newAd });
  } catch (err) {
  // This will print the full, detailed error message and stack trace
  console.error("FULL POST ERROR:", err); 
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
    const { title, description, price, category, location, keepImages } = req.body;
    const keepArr = typeof keepImages === 'string' ? [keepImages] : (keepImages || []);
    const update = { title, description, price, category, location, images: [...keepArr] };

    // CHANGED: Get the secure URL directly from file.path provided by Cloudinary
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(file => file.path);
      update.images.push(...newImageUrls);
    }

    const ad = await Ad.findByIdAndUpdate(id, update, { new: true });
    return res.json({ success: true, ad });
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ success: false, message: "Update failed", error: err.message });
  }
};