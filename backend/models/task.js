const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: 'user' },
  boardId: { type: mongoose.Schema.ObjectId, ref: 'board' },
  title: String,
  description: String,
  imgUrl: String,
  taskStatus: String,
  date: { type: Date, default: Date.now },
  assignedUser: { type: mongoose.Schema.ObjectId, ref: 'user' }
});

const task = mongoose.model('task', taskSchema);
module.exports = task;