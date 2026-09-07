const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser, getAllTasks } = require('../controllers/adminController');
const { registerValidator } = require('../validators/validators');

router.use(protect, adminOnly);

router.route('/users').get(getAllUsers).post(registerValidator, createUser);
router.route('/users/:id').get(getUserById).put(updateUser).delete(deleteUser);
router.get('/tasks', getAllTasks);

module.exports = router;
