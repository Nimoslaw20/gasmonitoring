const express = require('express');
const router = express.Router();
const authController = require('../../controllers/authority-controller/authority-user-auth');
//const authPolicy = require('../../middleware/authorization');

router.post('/authority-user/signup', authController.signup);
router.post('/authority-user/login', authController.login);

module.exports = router;
