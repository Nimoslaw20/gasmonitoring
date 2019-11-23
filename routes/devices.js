const deviceController = require('../controllers/devices');
const express = require('express');
const router = express.Router();

router.get('/devices', deviceController.list);
router.post('/devices/create', deviceController.create);
router.patch('/device/update/:id', deviceController.update);
router.delete('/device/delete/:id', deviceController.delete);

module.exports = router;
