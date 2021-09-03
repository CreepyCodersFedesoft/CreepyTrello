const TaskController = require('../controllers/task');
const multi = require('connect-multiparty');
const router = require('express').Router();

router.post('/createTask', TaskController.createTask);
router.get('/listTask/:boardId', TaskController.listTask);
router.put('/updateTask', TaskController.updateTask);
router.delete('/deleteTask/:_id', TaskController.deleteTask);

module.exports = router;