const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: 'user' },
  springId: { type: mongoose.Schema.ObjectId, ref: 'spring' },
  title: String,
  description: String,
  imgUrl: String,
  taskStatus: String,
  date: { type: Date, default: Date.now },
  assignedUser: { type: mongoose.Schema.ObjectId, ref: 'user' }
});

const task = mongoose.model('task', taskSchema);
module.exports = task;