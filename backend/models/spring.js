const mongoose = require("mongoose");

const SpringSchema = mongoose.Schema({
  boardId: { type: mongoose.Schema.ObjectId, ref: 'board' },
  title: {type: String},
  description: {type: String},
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: Date.now },
});

const spring = mongoose.model("spring", SpringSchema);
module.exports = spring;
