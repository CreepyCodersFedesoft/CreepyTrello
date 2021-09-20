const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: 'user' },
  sprintId: { type: mongoose.Schema.ObjectId, ref: 'sprint' },
  title: String,
  description: String,
  imgUrl: String,
  taskStatus: String,
  priority: Number,
  date: { type: Date, default: Date.now },
  assignedUser: { type: mongoose.Schema.ObjectId, ref: 'user' },
  countComments: { type: Number, default: 0},
});

const task = mongoose.model('task', taskSchema);
module.exports = task;