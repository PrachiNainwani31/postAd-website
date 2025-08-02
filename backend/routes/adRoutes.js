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
import storage from '../cloudinary.js'; 

const upload = multer({ storage });
const router = express.Router();

router.post('/post', upload.array('images',5), postAd);
router.get('/', getAllAds);
router.get('/:id', getAdById);
router.get('/user/:id', getUserAds);
// router.put('/:id', updateAd);
router.put('/:id', upload.array('images'), updateAd);
router.delete('/:id', deleteAd);

export default router;