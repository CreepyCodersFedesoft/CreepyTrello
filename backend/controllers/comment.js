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



const updateComment = async (req, res) => {
  let validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(400).send("Invalid id");

  if (!req.body.userId || !req.body.taskId || !req.body.text || !req.body.likes)
    return res.status(400).send("Process failed: Incomplete data");

  const comment = await Comment.findByIdAndUpdate(req.body._id, {
    userId: req.body.userId,
    taskId: req.body.taskId,
    text: req.body.text,
    likes: req.body.likes,
  });

  if (!comment) return res.status(400).send("comment not found");
  return res.status(200).send({ comment });
};

const listComment = async (req, res) => {
  const comment = await Comment.find({ taskId: req.params.taskId });
  if (!comment || comment.length == 0)
    return res.status(400).send("You have no assigned comment");
  return res.status(200).send({ comment });
};

//se elimina definitivamente
const deleteComment = async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(400).send("Invalid id");

  const comment = await Comment.findByIdAndDelete(req.params._id);
  if (!comment) return res.status(400).send("comment not found");

  return res.status(200).send({ message: "comment deleted" });
};

module.exports = { createComment, updateComment, listComment, deleteComment };
