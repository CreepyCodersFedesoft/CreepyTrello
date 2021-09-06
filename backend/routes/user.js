const UserController = require('../controllers/user');
const multiparty = require("connect-multiparty");
const mult = multiparty();
const Upload = require('../middleware/upload');
const router = require('express').Router();

router.post('/createUser', mult, Upload, UserController.createUser);
router.post('/createAdmin', mult, Upload, UserController.createAdmin);
router.post('/login', UserController.createAdmin);
router.get('/listUser/:name?', UserController.listUser);
router.get('/listUserAll/:name?', UserController.listUserAll);
router.get('/getRole/:email?', UserController.getRole);
router.put('/updateUser', mult, Upload, UserController.updateUser);
router.put('/deleteUser', UserController.deleteUser);

module.exports = router; 