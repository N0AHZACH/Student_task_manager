const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: false },
  dueDate: { type: Date, required: false }, // Field for the specific date
  status: { 
    type: String, 
    required: true,
    enum: ['Not Done', 'Doing', 'Done'], // The three allowed statuses
    default: 'Not Done' // New default status
  },
}, {
  timestamps: true,
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;