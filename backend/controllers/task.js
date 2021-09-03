const Task = require("../models/task");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const mongoose = require("mongoose");

const createTask = async (req, res) => {
  if (!req.body.userId || !req.body.boardId || !req.body.title || !req.body.description)
    return res.status(400).send("Process failed: Incomplete data");

  let imageUrl = "";
  if (req.files.image) {
    const url = req.protocol + "://" + req.get("host") + "/";
    const serverImg =
      "./uploads/" + moment().unix() + path.extname(req.files.image.path);
    fs.createReadStream(req.files.image.path).pipe(
      fs.createWriteStream(serverImg)
    );
    imageUrl =
      url + "uploads/" + moment().unix() + path.extname(req.files.image.path);
  }

  const task = new Task({
    userId: req.body.userId,
    boardId: req.body.boardId,
    title: req.body.title,
    description: req.body.description,
    imgUrl: imageUrl,
    taskStatus: "to-do",
  });

  const result = await task.save();
  if (!result) return res.status(400).send("Error register task");
  return res.status(200).send({ result });
};

const listTask = async (req, res) => {
  const task = await Task.find({ boardId: req.params.boardId });
  if (!task || task.length == 0)
    return res.status(400).send("You have no assigned task");
  return res.status(200).send({ task });
};

const updateTask = async (req, res) => {
  let validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(400).send("Invalid id");

  if (!req.body.title || !req.body.description || !req.body.taskStatus || !req.body.userId)
    return res.status(400).send("Process failed: Incomplete data");

  const task = await Task.findByIdAndUpdate(req.body._id, {
    userId: req.body.userId,
    title: req.body.title,
    description: req.body.description,
    taskStatus: req.body.taskStatus,
  });

  if (!task) return res.status(400).send("Task not found");
  return res.status(200).send({ task });
};

const deleteTask = async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(400).send("Invalid id");

  let taskImg = await Task.findById(req.params._id);
  taskImg = taskImg.imgUrl;
  taskImg = taskImg.split("/")[4];
  let serverImg = "./uploads/" + taskImg;

  const task = await Task.findByIdAndDelete(req.params._id);
  if (!task) return res.status(400).send("Task not found");

  try {
    fs.unlinkSync(serverImg);
  } catch (e) {
    console.log("Image no found in server");
  }

  return res.status(200).send({ message: "Task deleted" });
}; 

module.exports = { createTask, listTask, updateTask, deleteTask };
