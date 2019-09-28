var express = require('express');
var router = express.Router();
let i = 20000;
const moment = require('moment');
const {
  connect
} = require('mqtt');
const {
  mqtt
} = require('../config/env');
const client = connect(
  mqtt.url,
  mqtt.options
);
const async = require('async');
const Sensor = require('../models/sensor');
const debug = require('debug')('lpg:index.js');
client.once('connect', () => {
  debug('MQTT client connected.');
  client.subscribe('#', (err, granted) => {
    if (err) return debug(err);
    debug(`Connected to ${granted[0].topic}`);
  });
});

/* GET home page. */
router.get('/', function (req, res, next) {
  Sensor.findOne({}, {
    logs: {
      $slice: -1
    }
  }, function (err, result) {
    if (err) return res.status(500).render('error', {
      error: err
    })
    console.log(result)
    res.render('index', {
      title: 'LPG Mon HOME',
      result: result.logs[0]
    });
  });

});
router.get('/ping', function (req, res, next) {
  res.send('PONG');
});

router.get('/chartdata', (req, res) => {
  Sensor.findOne({}, {
    logs: {
      $slice: -10
    }
  }).exec((err, logs) => {
    if (err) return res.send(err);
    var chart = {
      chart: {
        caption: 'Concentration of LPG',
        subCaption: 'In PPM (parts per million)',
        xAxisName: 'Time',
        yAxisName: 'Concentration',
        theme: 'fusion'
      },
      data: []
    };
    async.forEachOf(
      logs.logs,
      (value, key, callback) => {
        try {
          chart.data[key] = {
            label: moment(value.time_stamp).fromNow('m'),
            value: value.concentration
          };
        } catch (e) {
          return callback(e);
        }
        callback();
      },
      err => {
        if (err) return res.status(500).send(err);
        res.json(chart);
      }
    );
    // res.json(logs);
  });
});
router.get('/logs', function (req, res, next) {
  res.render('table', {
    title: 'Raw Data'
  });
});
router.get('/tabledata', function (req, res) {
  Sensor.findOne({}, {
    logs: 1
  }).exec((err, result) => {
    if (err) return debug(err);
    res.json(result);
  });
});
router.get('/update', (req, res, next) => {
  let query = req.query;
  query.time_stamp = new Date();

  client.publish(req.query.channel, JSON.stringify(query), err => {
    if (err) {
      debug(err);
      return res.status(500).send(err.message);
    }
    Sensor.findOneAndUpdate({
      ser_no: req.query.channel
    }, {
      $addToSet: {
        logs: {
          humidity: req.query.humidity,
          concentration: req.query.conc,
          temperature: req.query.temperature,
          time_stamp: query.time_stamp
        }
      }
    }).exec((err, result) => {
      if (err) debug(err);
      debug(result);
    });
    return res.status(204).end();
  });
});

router.get('/stream', (req, res) => {
  req.socket.setTimeout(Number.MAX_SAFE_INTEGER);
  // req.socket.setTimeout((i *= 6));

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
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

client.on('error', err => {
  console.error(err);
  debug(err);
});