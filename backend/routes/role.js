const RoleController = require('../controllers/role');
const router = require('express').Router();
const validateUser = require('../middleware/validateUser');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/createRole', auth, validateUser, admin, RoleController.createRole);
router.get('/listRole', auth, validateUser, admin, RoleController.listRole);
router.get('/getDescription/:role?', auth, validateUser, admin, RoleController.getDescription);
router.post('/updateRole', auth, validateUser,  admin, RoleController.updateRole);

module.exports = router;