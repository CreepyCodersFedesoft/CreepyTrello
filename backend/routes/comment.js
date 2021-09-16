const CommentController = require('../controllers/comment');
const router = require('express').Router();
const auth = require('../middleware/auth');
const validateUser = require('../middleware/validateUser');

router.post('/createComment', auth, validateUser, CommentController.createComment);
router.put('/giveLike', auth, validateUser, CommentController.giveLike);
router.get('/listComment/:taskId', auth, validateUser, CommentController.listComment);
router.delete('/deleteComment/:_id', auth, validateUser, CommentController.deleteComment);

module.exports = router;