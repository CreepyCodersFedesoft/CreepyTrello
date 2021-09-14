const Board = require("../models/board");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const createBoard = async (req, res) => {
  if (!req.body.name || !req.body.description)
    return res.status(400).send("Incomplete Data");

   console.log(req.files);
   let boardImgUrl = "";
   if(req.files !== undefined && req.files.image.type){
    let url = req.protocol + "://" + req.get("host")
    let serverImg = "./uploads/" + moment().unix() + path.extname(req.files.image.path);
    fs.createReadStream(req.files.image.path).pipe(fs.createWriteStream(serverImg));
    boardImgUrl=url + "/uploads/" + moment().unix() + path.extname(req.files.image.path);
    console.log(boardImgUrl);
   }
   
  const board = new Board({
    userId: req.user._id,
    name: req.body.name,
    description: req.body.description,
    boardImg: boardImgUrl,
    dbStatus: true,
    userList: [],
  });

  const result = await board.save();
  if (!result) return res.status(400).send("Error creating Board");
  return res.status(200).send({ result });
};

const listBoard = async (req, res) => {
  const board = await Board.find({
    $or: [{ userId: req.user._id }, { userList: req.user._id }],
  });
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
const getBoardById = async (req, res) => {
  const board = await Board.findById(req.params._id);
  if (!board || board.length === 0)
    return res.status(400).send("You do not have any board");
  return res.status(200).send({ board });
}

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
const addListBoard = async (req, res) => {
  if (!req.body._id || !req.body.newUserId)
    return res.status(400).send("Error: empty data");

  let board = await Board.findById(req.body._id);
  if (
    !board ||
    board.length === 0 ||
    !board.userId.equals(mongoose.Types.ObjectId(req.user._id))
  )
    return res
      .status(400)
      .send("Error: No board found or you are not the owner");

  const doesBoardExist = await Board.exists({ userList: req.body.newUserId });
  if (doesBoardExist)
    return res.status(400).send("Error: User Already Invited");

  board = await Board.findByIdAndUpdate(req.body._id, {
    $push: { userList: req.body.newUserId },
  });

  if (!board) return res.status(400).send("Error: error to update board");

  res.status(200).send({ board });
};
const dropListBoard = async (req, res) => {
  if (!req.body._id || !req.body.newUserId)
    return res.status(400).send("Error: empty data");

  let board = await Board.findById(req.body._id);
  if (
    !board ||
    board.length === 0 ||
    !board.userId.equals(mongoose.Types.ObjectId(req.user._id))
  )
    return res
      .status(400)
      .send("Error: No board found or you are not the owner");

  const doesBoardExist = await Board.exists({ userList: req.body.newUserId });
  if (!doesBoardExist)
    return res.status(400).send("Error: User doesn't exist in board");

  board = await Board.findByIdAndUpdate(req.body._id, {
    $pull: { userList: req.body.newUserId },
  });

  if (!board) return res.status(400).send("Error: error to update board");

  res.status(200).send("User deleted of board");
};

module.exports = {
  createBoard,
  listBoard,
  updateBoard,
  deleteBoard,
  addListBoard,
  dropListBoard,
  getBoardById,
};
