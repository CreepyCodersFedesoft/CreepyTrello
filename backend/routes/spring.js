const router = require('express').Router();
const SpringController = require('../controllers/spring');
const auth = require('../middleware/auth');
const validateUser = require('../middleware/validateUser');

router.post('/createSpring', auth, validateUser, SpringController.createSpring);
router.get('/listSpring/:boardId?', auth, validateUser, SpringController.listSpring);
router.put('/updateSpring', auth, validateUser, SpringController.updateSpring);

module.exports = router;