const Task = require("../models/task");
const User = require("../models/user");
const History = require("../models/history");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
const mongoose = require("mongoose");

const createTask = async (req, res) => {
  if (
    !req.user._id ||
    !req.body.sprintId ||
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
  let assignUser = !req.body.assignedUser ? null : req.body.assignedUser;
  let priority = !req.body.priority ? 1 : req.body.priority;

  if (priority < 1 || priority > 5)
    return res.status(400).send("Error: priority must be in a range of 1 to 5");

  const task = new Task({
    userId: req.user._id,
    sprintId: req.body.sprintId,
    title: req.body.title,
    description: req.body.description,
    imgUrl: imageUrl,
    taskStatus: "to-do",
    assignedUser: assignUser,
    priority: priority,
  });

  const result = await task.save();
  if (!result) return res.status(400).send("Error register task");

  let history = new History({
    taskId: result._id,
    userId: req.user._id,
    actionType: "Created Task",
  });

  let resultHistory = await history.save();
  if (!resultHistory) console.log("failed to create history task");
  //console.log(resultHistory);

  return res.status(200).send({ result });
};

const listTask = async (req, res) => {
  //puede llegar una imagen y un usuario asignado
  const task = await Task.find({ sprintId: req.params.sprintId });
  if (!task || task.length == 0)
    return res.status(400).send({msg: "This Sprint haven't assigned task"});

  let history = new History({
    userId: req.user._id,
    actionType: "Listed Task",
  });

  let resultHistory = await history.save();
  if (!resultHistory) console.log("failed to create history task");
  //console.log(resultHistory);

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
    let tempImg = await Task.findById(req.body._id);
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
  if (!req.body.assignedUser) {
    let tempUser = await Task.findOne({ _id: req.body._id });
    assignUser = tempUser.assignedUser;
  } else {
    assignUser = req.body.assignedUser;
  }

  let priority;
  if (!req.body.priority) {
    let tempPriority = await Task.findOne({ _id: req.body._id });
    priority = tempPriority.priority;
  } else {
    priority = req.body.priority;
    if (priority < 1 || priority > 5)
      return res
        .status(400)
        .send("Error: priority must be in a range of 1 to 5");
  }

  const task = await Task.findByIdAndUpdate(req.body._id, {
    userId: req.body.userId,
    title: req.body.title,
    description: req.body.description,
    taskStatus: req.body.taskStatus,
    imgUrl: imageUrl,
    assignedUser: assignUser,
    priority: priority,
  });

  if (!task) return res.status(400).send("Task not found");

  //si todo va bien, borramos la imagen anterior
  if (
    imageUrl !== "" &&
    taskImg.userImg !== "" &&
    req.files.image != undefined
  ) {
    try {
      fs.unlinkSync(serverImg);
    } catch (err) {
      console.log("Image no found in server");
    }
  }

  let history = new History({
    taskId: req.body._id,
    userId: req.user._id,
    actionType: "Updated Task",
  });

  let resultHistory = await history.save();
  if (!resultHistory) console.log("failed to create history task");

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

  let history = new History({
    taskId: req.params._id,
    userId: req.user._id,
    actionType: "deleted Task",
  });

  let resultHistory = await history.save();
  if (!resultHistory) console.log("failed to create history task");
  //console.log(resultHistory);

  return res.status(200).send({ message: "Task deleted" });
};

//por el momento desde el front solo se controlará que el el usuario pertenezca al board
//esto a través de la funcion getUsersOnBoard que obtendra los usuarios del board actual
const assignUser = async (req, res) => {
  if (!req.body.assignedUser || !req.body._id || !req.user._id)
    return res.status(400).send("Error: empty data");

  let user = await User.findById(req.body.assignedUser);
  if (!user.dbStatus) return res.status(400).send("This user is inactive");

  let result = await Task.findOneAndUpdate(
    { _id: req.body._id },
    {
      assignedUser: req.body.assignedUser,
    }
  );

  if (!result) return res.status(400).send("Error to assign task");

  let history = new History({
    taskId: req.body._id,
    userId: req.user._id,
    actionType: "assigned Task",
  });

  let resultHistory = await history.save();
  if (!resultHistory) console.log("failed to create history task");
  //console.log(resultHistory);

  return res.status(200).send({msg: "Task assigned successfully"});
};

const listLogTask = async (req, res) => {
  let history = await History.find({ taskId: req.body.taskId });
  if (!history) return res.status(400).send("No logs for this task");
  return res.status(200).send({ history });
};

const findTask = async (req, res) => {
  const task = await Task.findOne({ _id: req.params["_id"] })
    .populate("sprintId")
    .exec();
  if (!task || task.lenght === 0) return res.status(400).send("No search task");
  return res.status(200).send({ task });
};

module.exports = {
  createTask,
  listTask,
  updateTask,
  deleteTask,
  assignUser,
  listLogTask,
  findTask,
};
