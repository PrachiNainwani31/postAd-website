import express from 'express';
import User from '../models/User.js';
import Ad from '../models/Ad.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

router.get('/users', authenticate, isAdmin, async (req, res) => {
  const users = await User.find({}, 'name email role');
  res.json(users);
});

router.delete('/users/:id', authenticate, isAdmin, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  await Ad.deleteMany({ userId: req.params.id }); 
  res.json({ success: true });
});

router.get('/users/:id/ads', authenticate, isAdmin, async (req, res) => {
  try {
    const ads = await Ad.find({ user: req.params.id });
    const user = await User.findById(req.params.id).select('name');

    if (!user) {
      return res.json({ ads, userName: 'Deleted User' });
    }

    res.json({ ads, userName: user.name });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

router.put('/ads/:id/status', authenticate, isAdmin, async (req, res) => {
  const { status } = req.body;
  const ad = await Ad.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(ad);
});

router.put('/ads/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { status } = req.body;

    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedAd) {
      return res.status(404).json({ message: 'Ad not found' });
    }

    res.json(updatedAd);
  } catch (err) {
    console.error("Error updating ad status:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/ads', authenticate, isAdmin, async (req, res) => {
  const allAds = await Ad.find().populate('user', 'name email');
  const order = { pending: 0, approved: 1, rejected: 2 };
  allAds.sort((a, b) => (order[a.status || 'pending'] - order[b.status || 'pending']));
  res.json(allAds);
});


export default router;