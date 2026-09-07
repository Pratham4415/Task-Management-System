const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginValidator } = require('../validators/validators');

router.post('/login', loginValidator, login);
router.get('/me', protect, getMe);

module.exports = router;
