const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

const taskValidator = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('status').optional().isIn(['pending', 'in-progress', 'done']).withMessage('Invalid status'),
  body('dueDate').notEmpty().withMessage('Due date is required').isISO8601().withMessage('Invalid date format')
];

const taskUpdateValidator = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 500 }),
  body('status').optional().isIn(['pending', 'in-progress', 'done']).withMessage('Invalid status'),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format')
];

module.exports = { registerValidator, loginValidator, taskValidator, taskUpdateValidator };
