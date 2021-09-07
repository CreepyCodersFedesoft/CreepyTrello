const CommentController = require('../controllers/comment');
const router = require('express').Router();
const auth = require('../middleware/auth');
const validateUser = require('../middleware/validateUser');

<<<<<<< HEAD
router.post('/createComment', auth, validateUser, CommentController.createComment);
=======
router.post('/createComment', CommentController.createComment);
router.post('/updateComment', CommentController.updateComment);
>>>>>>> 65815399b8317d4478eba353420cc3ea34563db1
router.get('/listComment', CommentController.listComment);
router.delete('/deleteComment/:_id', CommentController.deleteComment);

module.exports = router;