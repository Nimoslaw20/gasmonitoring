const stationUserController = require('../controllers/station/station-user');
const express = require('express');
const router = express.Router();

router
  .route('/station/user')
  .get(stationUserController.read)
  .post(stationUserController.create);

router
  .route('/station/user/:id')
  .patch(stationUserController.update)
  .delete(stationUserController.delete);

module.exports = router;
