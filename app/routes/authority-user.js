const express = require('express');
const router = express.Router();
const authController = require('../controllers/authority-controller/authority-user-auth');
const authPolicy = require('../../middleware/authorization');

router.post(
  '/authority-user/signup',
  authPolicy.checkAuth,
  authController.signup
);
router.post(
  '/authority-user/login',
  authPolicy.checkAuth,
  authController.login
);

module.exports = router;
