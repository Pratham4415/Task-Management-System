const express = require('express');
const router = express.Router();
const { register, login, getMe, refreshAccessToken, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { registerValidator, loginValidator } = require('../validators/validators');

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/me', protect, getMe);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);

module.exports = router;
