const Comment = require("../models/comment");

const createComment = async (req, res) => {
  if (!req.body.taskId || !req.body.text)
    return res.status(400).send("Incomplete Data");

  const comment = new Comment({
    userId: req.user._id,
    taskId: req.body.taskId,
    text: req.body.text,
  });

  const result = await comment.save();
  if (!result) return res.status(400).send("Error registering comment");
  return res.status(200).send({ result });
};

const listComment = async (req, res) => {
  const comment = await Comment.find({ taskId: req.params.taskId }).sort('-date')
    .populate("userId")
    .exec();
  if (!comment || comment.length == 0)
    return res.status(400).send("You have no assigned comment");

  let filteredUserData = [];

  comment.forEach((user) => {
    user.userId = {
      _id: user.userId._id,
      name: user.userId.name,
      userImg: user.userId.userImg,
      date: user.userId.date,
      dbStatus: user.userId.dbStatus,
    };
    filteredUserData.push(user);
  });

  return res.status(200).send({ filteredUserData });
};

const deleteComment = async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(400).send("Invalid id");

  const comment = await Comment.findByIdAndDelete(req.params._id);
  if (!comment) return res.status(400).send("comment not found");

  return res.status(200).send({ message: "comment deleted" });
};

const giveLike = async (req, res) => {
  
  if (!req.body._id || !req.user._id)
    return res.status(400).send("Error: There are empty fields");

  let comment = await Comment.findById(req.body._id);
  if (!comment) return res.status(400).send("Error: comment no found");

  let result;
  if (comment.userLikes.includes(req.user._id)) {
    result = await Comment.findByIdAndUpdate(req.body._id, {
      likes: comment.likes - 1,
      $pull: { userLikes: req.user._id },
    });
    if (!result) return res.status(400).send("Error to drop like");
    return res.status(200).send({msg :"Unliked!"});
  } else {
    result = await Comment.findByIdAndUpdate(req.body._id, {
      likes: comment.likes + 1,
      $push: { userLikes: req.user._id },
    });
    if (!result) return res.status(400).send("Error to give like");
    return res.status(200).send({msg :"Liked!"});
  }
};

module.exports = { createComment, listComment, deleteComment, giveLike };
