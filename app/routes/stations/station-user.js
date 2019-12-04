const stationUserController = require('../../controllers/station/station-user');
const authStationUserController = require('../../controllers/station/station-user-auth');
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

router.route('/station/user/login').post(authStationUserController.login);

module.exports = router;
