const mongoose = require('mongoose');

const boardSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.ObjectId, ref: 'user' }, 
  name: String,
  description: String,
  boardImg: String,
  date: { type: Date, default: Date.now },
  dbStatus: { type: Boolean, default: true },
  userList: [{ type: mongoose.Schema.ObjectId, ref: 'user' }],
  statusList: [ { type: String } ],
});

const board = mongoose.model('board', boardSchema);
module.exports = board;
