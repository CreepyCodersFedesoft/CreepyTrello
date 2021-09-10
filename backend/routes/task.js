const TaskController = require('../controllers/task');
const router = require('express').Router();
const multiparty = require("connect-multiparty");
const mult = multiparty();
const validateUser = require('../middleware/validateUser');
const auth = require('../middleware/auth');
const Upload = require("../middleware/upload");

router.post('/createTask', mult, Upload, auth, validateUser, TaskController.createTask);
router.get('/listTask/:boardId', TaskController.listTask);
router.put('/updateTask', TaskController.updateTask);
router.delete('/deleteTask/:_id', TaskController.deleteTask);

module.exports = router;