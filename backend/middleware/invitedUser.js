//opcional, valida si un board pertenece a un usuario o si este se encuentra invitado al board
const Board = require("../models/board");

const invitedUser = async (req, res, next) => {
  let board = await Board.find({
    $or: [{ userId: req.user._id }, { userList: req.user._id }],
  });
  if (!board || board.length === 0)
    return res
      .status(400)
      .send("Authorization denied: no found boards");
  
  console.log(board);

  next();
};

module.exports = invitedUser;
