const UserController = require('../controllers/user');
const multiparty = require("connect-multiparty");
const mult = multiparty();
const Upload = require('../middleware/upload');
const validateUser = require('../middleware/validateUser');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = require('express').Router();

router.post('/createUser', mult, Upload,   UserController.createUser);
router.post('/createAdmin', mult, Upload, auth, validateUser, admin,   UserController.createAdmin);
router.post('/login', UserController.login);
router.get('/listUser/:name?', auth, validateUser, UserController.listUser);
router.get('/listUserAll/:name?', auth, validateUser, UserController.listUserAll);
router.get('/activateUser/:email?',  UserController.activateUser);
router.get('/getRole/:email?', auth, validateUser, UserController.getRole);
router.get('/getEmail', auth, validateUser, UserController.getEmail);
router.get('/getAllEmails', auth, validateUser, UserController.getAllEmails);
router.put('/updateUser', mult, Upload, auth, validateUser, UserController.updateUser);//actualiza el propio usuario y no todos, por ello no va con admin
router.put('/deleteUser', auth, validateUser, admin, UserController.deleteUser);

module.exports = router; 