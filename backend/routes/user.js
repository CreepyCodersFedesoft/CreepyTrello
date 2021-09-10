const UserController = require('../controllers/user');
const multiparty = require("connect-multiparty");
const mult = multiparty();
const Upload = require('../middleware/upload');
const validateUser = require('../middleware/validateUser');
const auth = require('../middleware/auth');
const router = require('express').Router();

router.post('/createUser', mult, Upload, UserController.createUser);
router.post('/createAdmin', mult, Upload, UserController.createAdmin);
router.post('/login', UserController.login);
router.get('/listUser/:name?', UserController.listUser);
router.get('/listUserAll/:name?', UserController.listUserAll);
router.get('/getRole/:email?', UserController.getRole);
router.get('/getEmail', auth, validateUser, UserController.getEmail);
router.put('/updateUser', mult, Upload, auth, validateUser, UserController.updateUser);
router.put('/deleteUser', UserController.deleteUser);

module.exports = router; 