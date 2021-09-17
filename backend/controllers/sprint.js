const Sprint = require("../models/sprint");
const Board = require("../models/board");
const fs = require('fs');
const Task = require("../models/task");

const createSprint = async (req, res) => {
  if (
    !req.body.boardId ||
    !req.body.title ||
    !req.body.description ||
    !req.body.startDate ||
    !req.body.endDate
  )
    return res.status(400).send("Error: Empty Data");

  //comprobamos que el board exista
  let existingBoard = await Board.findOne({ boardId: req.body.boardId });
  if (!existingBoard) return res.status(400).send("Error: Board doesnt exist");

  //comprobamos que la fecha de terminacion sea mayor a la fecha de inicio
  if (Date.parse(req.body.startDate) > Date.parse(req.body.endDate))
    return res
      .status(400)
      .send("Error: the start date cannot be greater than the end date");
  
  //creamos el objeto
  let sprint = new Sprint({
    boardId: req.body.boardId,
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });

  let result = await sprint.save();
  if (!result) return res.status(400).send("Error: error to register sprint");
  return res.status(200).send({ result });
};
const listSprint = async (req, res) => {
  let sprint = await Sprint.find({ boardId: req.params["boardId"] })
    .populate("boardId")
    .exec();
  if (!sprint) return res.status(400).send("No sprint for this board");
  return res.status(200).send({ sprint });
};
const updateSprint = async (req, res) => {
  if (
    !req.body._id ||
    !req.body.boardId ||
    !req.body.title ||
    !req.body.description ||
    !req.body.startDate ||
    !req.body.endDate ||
    req.body.sprintStatus == undefined
  )
    return res.status(400).send("Error: Empty Data");

  //revisamos que el usuario pertenezca al board
  const board = await Board.find({
    $or: [{ userId: req.user._id }, { userList: req.user._id }],
  });
  let arrayBoardId = [];
  board.forEach((boardId) => {
    arrayBoardId.push(String(boardId._id));
  });
  if (!arrayBoardId.includes(String(req.body.boardId)))
    return res.status(400).send("You no have permission to update");

  //comprobamos que la fecha de terminacion sea mayor a la fecha de inicio
  if (Date.parse(req.body.startDate) > Date.parse(req.body.endDate))
    return res
      .status(400)
      .send("Error: the start date cannot be greater than the end date");

  //actualizamos
  let result = await Sprint.findByIdAndUpdate(req.body._id, {
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    sprintStatus: req.body.sprintStatus,
  });
  if (!result) return res.status(400).send("Error to update sprint");

  return res.status(201).send({ result });
}; //actualizar fechas, titulo, descripcion y estado

const deleteSprint = async (req, res) => {
  if (!req.params._id) return res.status(400).send("Error: no sprint Id");

  //guardamos las url de las images a borrar
  let task = await Task.find({ sprintId: req.params._id });
  let taskUrls = [];
  task.forEach((taskUrl) => {
    taskUrls.push(taskUrl.imgUrl);
  });
  //eliminamos las tareas asociadas al sprint
  let TaskFoundToDeleted = await Task.deleteMany({sprintId: req.params._id});
  if(!TaskFoundToDeleted) return res.status(400).send('Error to delete associated tasks');

  //si elimino correctamente las tareas, ahora eliminamos las imagenes de dichas tareas
  taskUrls.forEach((url) => {
    if (url !== "") {
      try {
        url = "./uploads/" + url.split("/")[4];
        fs.unlinkSync(url);
        console.log(url + " eliminated");
      } catch (err) {
        console.log("Image no found in server" +err);
      }
    }
  });

  //finalmente eliminamos el sprint
  let result = await Sprint.findByIdAndDelete(req.params._id);
  if(!result) return res.status(400).send('Error to delete sprint');
  
  return res.status(200).send({message: 'Sprint Deleted'});
};

const searchSprint = async (req, res) => {
  const sprint = await Sprint.findOne({ _id: req.params["_id"] });
  if(!sprint || sprint.length === 0) return res.status(400).send("Not find results");
  return res.status(200).send({ sprint });
}

module.exports = { createSprint, updateSprint, listSprint, deleteSprint, searchSprint };
