const BoardController = require('../controllers/board');
const router = require('express').Router();
const multiparty = require("connect-multiparty");
const mult = multiparty();
const Upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const validateUser = require('../middleware/validateUser');
const invitedUser = require('../middleware/invitedUser');

router.post('/createBoard', auth, validateUser, mult, Upload, BoardController.createBoard);
router.get('/listBoard',  auth, validateUser, BoardController.listBoard);
router.put('/updateBoard', auth, validateUser, invitedUser, mult, Upload, BoardController.updateBoard);
router.delete('/deleteBoard/:_id', auth, validateUser, BoardController.deleteBoard);

module.exports = router;