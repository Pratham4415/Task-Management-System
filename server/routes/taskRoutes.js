const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { taskValidator, taskUpdateValidator } = require('../validators/validators');

router.use(protect);

router.route('/').get(getTasks).post(taskValidator, createTask);
router.route('/:id').put(taskUpdateValidator, updateTask).delete(deleteTask);

module.exports = router;
