const SendGridController = require('../controllers/sendgrid');
const router = require('express').Router();

router.post('/sendMail',  SendGridController.sendMail);


module.exports = router;