const mongoose = require("mongoose");

const SprintSchema = mongoose.Schema({
  boardId: { type: mongoose.Schema.ObjectId, ref: 'board' },
  title: {type: String},
  description: {type: String},
  startDate: { type: Date },
  endDate: { type: Date },
  sprintStatus: { type: Boolean, default: true},
  date: { type: Date, default: Date.now },
});

const sprint = mongoose.model("sprint", SprintSchema);
module.exports = sprint;
