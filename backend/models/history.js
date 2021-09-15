const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
  taskId: { type: mongoose.Schema.ObjectId, ref: 'task' },
  userId: { type: mongoose.Schema.ObjectId, ref: 'user' },
  actionType: String,
  date: { type: Date, default: Date.now},
});

const history = mongoose.model('history', historySchema);
module.exports = history;