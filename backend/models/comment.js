const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: 'user' }, 
  taskId: { type: mongoose.Schema.ObjectId, ref: 'task' }, 
  text: String,
  likes: Number,
  date: { type: Date, default: Date.now },
  dbStatus: { type: Boolean, default: true },
});

const comment = mongoose.model('comment', commentSchema);
module.exports = comment;