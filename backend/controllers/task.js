const Task = require("../models/task");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const mongoose = require("mongoose");

const createTask = async (req, res) => {
  if (
    !req.user._id ||
    !req.body.springId ||
    !req.body.title ||
    !req.body.description
  )
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

  //si no tiene un usuario asignado, le asignamos el que creo la tearea
  let assignUser = !req.body.assignedUser ? req.user._id : req.body.assignedUser;

  const task = new Task({
    userId: req.user._id,
    springId: req.body.springId,
    title: req.body.title,
    description: req.body.description,
    imgUrl: imageUrl,
    taskStatus: "to-do",
    assignedUser: assignUser,
  });

  const result = await task.save();
  if (!result) return res.status(400).send("Error register task");
  return res.status(200).send({ result });
};

const listTask = async (req, res) => {//puede llegar una imagen y un usuario asignado
  const task = await Task.find({ springId: req.params.springId });
  if (!task || task.length == 0)
    return res.status(400).send("You have no assigned task");
  return res.status(200).send({ task });
};

const updateTask = async (req, res) => {
  let validId = mongoose.Types.ObjectId.isValid(req.user._id);
  if (!validId) return res.status(400).send("Invalid id");

  if (
    !req.body._id ||
    !req.body.title ||
    !req.body.description ||
    !req.body.taskStatus
  )
    return res.status(400).send("Process failed: Incomplete data");

  let imageUrl = "";
  if (req.files.image) {
    if (req.files.image.type != null) {
      const url = req.protocol + "://" + req.get("host") + "/";
      const serverImg =
        "./uploads/" + moment().unix() + path.extname(req.files.image.path);
      fs.createReadStream(req.files.image.path).pipe(
        fs.createWriteStream(serverImg)
      );
      imageUrl = url + serverImg.slice(2);
    }
  } else {
    let tempImg = await Task.findById(req.body._id);;
    imageUrl = tempImg.imgUrl;
  }

  //guardamos la ruta de la imagen anterior para eliminarla
  let serverImg = "";
  let taskImg = await Task.findById(req.body._id);
  if (taskImg.userImg !== "") {    
    let userImage = taskImg.imgUrl;
    userImage = userImage.split("/")[4];
    serverImg = "./uploads/" + userImage;
  }  

  //si no tiene un usuario asignado, le asignamos el que creo la tearea
  let assignUser;
  if(!req.body.assignedUser) {
    let tempUser = await Task.findOne({_id: req.body._id});
    assignUser = tempUser.assignedUser;
  }  else {
    assignUser = req.body.assignedUser;  
  }

  const task = await Task.findByIdAndUpdate(req.body._id, {
    userId: req.body.userId,
    title: req.body.title,
    description: req.body.description,
    taskStatus: req.body.taskStatus,
    imgUrl: imageUrl,
    assignedUser: assignUser,
  });

  if (!task) return res.status(400).send("Task not found");

  //si todo va bien, borramos la imagen anterior
  if (imageUrl !== "" && taskImg.userImg !== "" && req.files.image != undefined) {
    try {
      fs.unlinkSync(serverImg);
    } catch (err) {
      console.log("Image no found in server");
    }
  }

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

const assignUser = async (req, res) => {};

module.exports = { createTask, listTask, updateTask, deleteTask, assignUser };
