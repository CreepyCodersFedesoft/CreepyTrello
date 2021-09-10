const Spring = require("../models/spring");
const Board = require("../models/board");

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
  if (!result) return res.status(400).send("Error: error to register spring");
  return res.status(200).send({ result });
};
const listSpring = async (req, res) => {
  let spring = await Spring.find({ boardId: req.params["boardId"] }).populate('boardId').exec();
  if(!spring) return res.status(400).send('No spring for this board');
  return res.status(200).send({ spring });
};
const updateSpring = async (req, res) => {};//actualizar fechas, titulo, descripcion y estado

module.exports = { createSpring, updateSpring, listSpring };
