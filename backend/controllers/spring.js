const Spring = require("../models/spring");
const Board = require("../models/board");
const fs = require('fs');
const Task = require("../models/task");

const createSpring = async (req, res) => {
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
  if (Date.parse(req.body.startDate) > Date.parse(req.body.endtDate))
    return res
      .status(400)
      .send("Error: the start date cannot be greater than the end date");

  //creamos el objeto
  let spring = new Spring({
    boardId: req.body.boardId,
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });

  let result = await spring.save();
  if (!result) return res.status(400).send("Error: error to register sprint.");
  return res.status(200).send({ result });
};
const listSpring = async (req, res) => {
  let spring = await Spring.find({ boardId: req.params["boardId"] })
    .populate("boardId")
    .exec();
  if (!spring) return res.status(400).send("No sprint for this board");
  return res.status(200).send({ spring });
};
const updateSprint = async (req, res) => {
  if (
    !req.body._id ||
    !req.body.boardId ||
    !req.body.title ||
    !req.body.description ||
    !req.body.startDate ||
    !req.body.endDate ||
    req.body.springStatus == undefined
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
    return res.status(400).send("You don't have permission to update");

  //actualizamos
  let result = await Spring.findByIdAndUpdate(req.body._id, {
    title: req.body.title,
    description: req.body.description,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    springStatus: req.body.springStatus,
  });
  if (!result) return res.status(400).send("Error to update sprint");

  return res.status(201).send({ result });
}; //actualizar fechas, titulo, descripcion y estado

const deleteSprint = async (req, res) => {
  if (!req.params._id) return res.status(400).send("Error: No sprint Id");

  //guardamos las url de las images a borrar
  let task = await Task.find({ springId: req.params._id });
  let taskUrls = [];
  task.forEach((taskUrl) => {
    taskUrls.push(taskUrl.imgUrl);
  });
  //eliminamos las tareas asociadas al sprint
  let TaskFoundToDeleted = await Task.deleteMany({springId: req.params._id});
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

  //finalmente eliminamos el spring
  let result = await Spring.findByIdAndDelete(req.params._id);
  if(!result) return res.status(400).send('Error to delete sprint');
  
  return res.status(200).send({message: 'Spring Deleted'});
};

module.exports = { createSpring, updateSprint, listSpring, deleteSprint };
