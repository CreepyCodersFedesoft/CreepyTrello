const UserController = require('../controllers/user');
const router = require('express').Router();

router.post('/createUser', UserController.createUser);
router.post('/createAdmin', UserController.createAdmin);
router.post('/login', UserController.createAdmin);
router.get('/listUser/:name?', UserController.listUser);
router.get('/listUserAll/:name?', UserController.listUserAll);
router.get('/getRole/:email?', UserController.getRole);
router.put('/updateUser', UserController.updateUser);
router.put('/deleteUser', UserController.deleteUser);

module.exports = router; 