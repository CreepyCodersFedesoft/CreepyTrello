const router = require('express').Router();
const SprintController = require('../controllers/sprint');
const auth = require('../middleware/auth');
const validateUser = require('../middleware/validateUser');

router.post('/createSprint', auth, validateUser, SprintController.createSprint);
router.get('/listSprint/:boardId?', auth, validateUser, SprintController.listSprint);
router.put('/updateSprint', auth, validateUser, SprintController.updateSprint);
router.delete('/deleteSprint/:_id', auth, validateUser, SprintController.deleteSprint);
router.get('/searchSprint/:_id', auth, validateUser, SprintController.searchSprint);

module.exports = router;