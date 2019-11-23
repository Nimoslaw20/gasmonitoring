const stationController = require('../controllers/stations.js');
const express = require('express');
const router = express.Router();

router.get('/station', stationController.list);
router.post('/station/create', stationController.create);
router.patch('/station/update/:id', stationController.update);
router.delete('/station/delete/:id', stationController.delete);

module.exports = router;
