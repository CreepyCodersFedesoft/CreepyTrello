const TaskController = require('../controllers/task');
const router = require('express').Router();
const multiparty = require("connect-multiparty");
const mult = multiparty();
const validateUser = require('../middleware/validateUser');
const auth = require('../middleware/auth');
const Upload = require("../middleware/upload");

router.post('/createTask', mult, Upload, auth, validateUser, TaskController.createTask);
router.get('/listTask/:springId', auth, validateUser, TaskController.listTask);
router.get('/listLogTask', auth, validateUser, TaskController.listLogTask);
router.put('/updateTask',  mult, Upload, auth, validateUser, TaskController.updateTask);
router.put('/assignUser',  auth, validateUser, TaskController.assignUser);
router.delete('/deleteTask/:_id', auth, validateUser, TaskController.deleteTask);


module.exports = router;