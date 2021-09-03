const Task = require("../models/task");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const createTask = async (req, res) => {
  if (!req.body.boardId || !req.body.title || !req.body.description)
    return res.status(400).send("Process failed: Incomplete data");

  /*  
  let imageUrl = "";
  if (req.files.image) {
    const url = req.protocol + "://" + req.get("host") + "/";
    const serverImg =
      "./uploads" + moment().unix() + path.extname(req.files.image.path);
    fs.createReadStream(req.files.image.path).pipe(
      fs.createWriteStream(serverImg)
    );
    imageUrl =
      url + "uploads/" + moment().unix() + path.extname(req.files.image.path);
  }
  */
  const task = new Task({
    userId: req.body._id,
    boardId: req.body.boardId,
    title: req.body.title,
    description: req.body.description,
    //imgUrl: imageUrl,
    taskStatus: "to-do"
  });

  const result = await task.save();
  if(!result) return res.status(400).send("Error register task");
  return res.status(200).send({result});
};

const listTask = async (req, res) => {};

const updateTask = async (req, res) => {};

const deleteTask = async (req, res) => {}; //este si elimina definitivamente

module.exports = { createTask, listTask, updateTask, deleteTask };
