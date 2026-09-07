const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'done'],
    default: 'pending'
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
