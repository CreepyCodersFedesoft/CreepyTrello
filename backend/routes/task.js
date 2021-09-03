const TaskController = require('../controllers/task');
const multi = require('connect-multiparty');
const router = require('express').Router();
const multiparty = require("connect-multiparty");
const mult = multiparty();
const Upload = require("../middleware/upload");

router.post('/createTask', mult, Upload, TaskController.createTask);
router.get('/listTask/:boardId', TaskController.listTask);
router.put('/updateTask', TaskController.updateTask);
router.delete('/deleteTask/:_id', TaskController.deleteTask);

module.exports = router;