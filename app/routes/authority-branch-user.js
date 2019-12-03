const express = require('express');
const router = express.Router();
const authorityUserController = require('../controllers/authority-branch/authority-branch-user-controller');

router
  .route('/authority-branch/users')
  .get(authorityUserController.read)
  .post(authorityUserController.create);

router
  .route('authority-branch/user/:id')
  .patch(authorityUserController.update)
  .delete(authorityUserController.delete);

module.exports = router;
