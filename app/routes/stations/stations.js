const stationController = require('../../controllers/station/stations');
const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/authorization');

router
  .route('/station')
  .get(auth.checkAuth, stationController.read)
  .post(stationController.create);

router
  .route('/station/:id')
  .patch(stationController.update)
  .delete(stationController.delete);

router.get(
  '/authority-branch/:id/stations',
  stationController.stationsPerAuthority
);
router.get(
  '/authority-branch/:id/station-user/:id',
  stationController.stationUserPerAuthority
);

module.exports = router;
