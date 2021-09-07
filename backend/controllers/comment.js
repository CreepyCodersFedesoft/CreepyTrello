const Comment = require("../models/comment");


const createComment = async (req, res) => {
  if (!req.body.text) return res.status(400).send("Incomplete Data");

  const comment = new Comment({
    userId: req.user._id,
    boardId: req.board._id,
    text: req.body.text,
    dbStatus: true,
  });

  const result = await comment.save();
  if(!result) return res.status(400).send("Error registering comment");
  return res.status(200).send({result});
}; 


const listComment = async (req, res) => {};
const deleteComment = async (req, res) => {}; //se elimina definitivamente

module.exports = { createComment, listComment, deleteComment };
