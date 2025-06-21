const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateToken } = require('../controllers/authController');
router.get('/validate', validateToken);

router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);

module.exports = router;
