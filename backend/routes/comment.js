const CommentController = require('../controllers/comment');
const router = require('express').Router();
const auth = require('../middleware/auth');
const validateUser = require('../middleware/validateUser');

router.post('/createComment', auth, validateUser, CommentController.createComment);
router.get('/listComment', CommentController.listComment);
router.delete('/deleteComment/:_id', CommentController.deleteComment);

module.exports = router;