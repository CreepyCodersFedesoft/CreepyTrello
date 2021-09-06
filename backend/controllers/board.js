const Board = require("../models/board");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

let userList = [];

const createBoard = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send("Incomplete Data");

  let boardImgUrl = "";
  if (req.files.image) {
    if (req.files.image.type != null) {
      const url = req.protocol + "://" + req.get("host") + "/";
      const boardServerImg =
        "./uploads/" + moment().unix() + path.extname(req.files.image.path);
      fs.createReadStream(req.files.image.path).pipe(
        fs.createWriteStream(boardServerImg)
      );
      boardImgUrl = url + boardServerImg.slice(2);
      console.log(boardImgUrl);
    }
  }

  const board = new Board({
    userId: req.user._id,
    name: req.body.name,
    description: req.body.description,
    boardImg: boardImgUrl,
    dbStatus: true,
    userList: userList,
  });

  const result = await board.save();
  if (!result) return res.status(400).send("Error creating Board");
  return res.status(200).send({ result });
};

const listBoard = async (req, res) => {
  const board = await Board.find({ $or: [{ userId: req.user._id }, { userList: req.user._id }] });
  if (!board || board.length === 0)
    return res.status(400).send("You do not have any board");
  return res.status(200).send({ board });
};
const updateBoard = async (req, res) => {
  let validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(400).send("Invalid id");
  if (!req.body._id || !req.body.name || !req.body.description)
    return res.status(400).send("Incomplete Data");

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
    imageUrl = req.body.userImg;
  }

  //guardamos la ruta de la imagen anterior para eliminarla
  let serverImg = "";
  let userImg = await Board.findById(req.body._id);
  if (userImg.boardImg !== "") {
    let userImage = userImg.boardImg;
    userImage = userImage.split("/")[4];
    serverImg = "./uploads/" + userImage;
  }

  const board = await Board.findByIdAndUpdate(req.body._id, {
    userId: req.user._id,
    name: req.body.name,
    description: req.body.description,
    statusList: req.body.statusList,
    boardImg: imageUrl,
  });
  if (!board) return res.status(400).send("Task not found");
  //si todo va bien, borramos la imagen anterior
  if (userImg.userImg !== "") {
    try {
      fs.unlinkSync(serverImg);
    } catch (err) {
      console.log("Image no found in server");
    }
  }
  return res.status(200).send({ board });
};
const deleteBoard = async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(400).send("Invalid id");

  let boardImg = await Board.findById(req.params._id);
  boardImg = boardImg.boardImg;
  boardImg = boardImg.split("/")[4];
  let boardServerImg = "./uploads/" + boardImg;

  const board = await Board.findByIdAndDelete(req.params._id);
  if (!board) return res.status(400).send("Board not found");

  try {
    fs.unlinkSync(boardServerImg);
  } catch (e) {
    console.log("Image no found in server");
  }
  return res.status(200).send({ message: "Board deleted" });
};

module.exports = { createBoard, listBoard, updateBoard, deleteBoard };
