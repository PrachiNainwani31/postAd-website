// routes/adRoutes.js
import express from 'express';
import {
  postAd,
  getAdById,
  getAllAds,
  getUserAds,
  deleteAd,
  updateAd
} from '../controllers/adController.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

// CREATE
router.post('/post', upload.array('images'), postAd);

// READ
router.get('/', getAllAds);
router.get('/:id', getAdById);
router.get('/user/:id', getUserAds);

// UPDATE
router.put('/:id', updateAd);

// DELETE
router.delete('/:id', deleteAd);

export default router;
