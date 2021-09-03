const BoardController = require('../controllers/board');
const router = require('express').Router();

router.post('/createBoard', BoardController.createBoard);
router.get('/listBoard', BoardController.listBoard);
router.put('/updateBoard', BoardController.updateBoard);
router.put('/deleteBoard', BoardController.deleteBoard);

module.exports = router;