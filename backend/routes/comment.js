const CommentController = require('../controllers/comment');
const router = require('express').Router();

router.post('/createComment', CommentController.createComment);
router.get('/listComment', CommentController.listComment);
router.delete('/deleteComment/:_id', CommentController.deleteComment);

module.exports = router;