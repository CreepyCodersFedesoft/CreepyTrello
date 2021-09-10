const mongoose = require("mongoose");

const SpringSchema = mongoose.Schema({
  boardId: { type: mongoose.Schema.ObjectId, ref: 'board' },
  title: {type: String},
  description: {type: String},
  startDate: { type: Date },
  endDate: { type: Date },
  springStatus: { type: Boolean, default: true},
  date: { type: Date, default: Date.now },
});

const spring = mongoose.model("spring", SpringSchema);
module.exports = spring;
