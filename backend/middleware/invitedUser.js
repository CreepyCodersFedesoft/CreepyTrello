//opcional, valida si un board pertenece a un usuario o si este se encuentra invitado al board
const Board = require("../models/board");

const invitedUser = async (req, res, nest) => {
  let board = await Board.find({
    _id: req.body._id,
    $or: [{ userId: req.user._id }, { userList: req.user._id }],
  });
  if (!board || board.length === 0)
    return res
      .status(400)
      .send("Authorization denied: You do not have permission");
  next();
};

module.exports = invitedUser;
