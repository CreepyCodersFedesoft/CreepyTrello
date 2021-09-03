const RoleController = require('../controllers/role');
const router = require('express').Router();

router.post('/createRole', RoleController.createRole);
router.get('/listRole', RoleController.listRole);
router.put('/updateRole', RoleController.updateRole);

module.exports = router;