const deviceController = require('../controllers/devices');
const express = require('express');
const router = express.Router();
const Device = require('../models/devices/device');
const debug = require('debug')('LPGDetection:index.js');
const client = require('../controllers/mqttController');

router
  .route('/device')
  .get(deviceController.read)
  .post(deviceController.create);

router
  .route('/device/:id')
  .patch(deviceController.update)
  .delete(deviceController.delete);

router.get('/data', (req, res, next) => {
  let query = req.query;
  query.time_stamp = new Date();

  //publish to channel
  client.publish(req.query.channel, JSON.stringify(query), err => {
    console.log(req.query.channel);
    if (err) {
      debug(err);
      return res.status(500).send(err.message);
    }

    Device.findOneAndUpdate(
      { ser_no: req.query.ser_no },
      {
        $set: {
          last_online: Date.now(),
        },
        $push: {
          logs: {
            humidity: req.query.humidity,
            concentration: req.query.conc,
            temperature: req.query.temperature,
            time_stamp: query.time_stamp,
          },
        },
      }
    ).exec((err, result) => {
      if (err) debug(err);
      debug(result);
      return res.status(204).end();
    });
  });
});

router.get('/stream', (req, res) => {
  req.socket.setTimeout(Number.MAX_SAFE_INTEGER);
  // req.socket.setTimeout((i *= 6));

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });
  res.write('\n');

  var timer = setInterval(() => {
    res.write(':' + '\n');
  }, 18000);

  // When the data arrives, send it in the form
  client.on('message', (topic, message) => {
    // if (topic == process.env.MQTT_CHANNEL)
    res.write('data:' + message + '\n\n');
  });

  req.on('close', () => {
    clearTimeout(timer);
  });
});

module.exports = router;
