var express = require('express');
var router = express.Router();
//let i = 20000;


const moment = require('moment');
const {connect} = require('mqtt');
const {mqtt} = require('../config/env');
const client = connect(mqtt.url,mqtt.options); // connect to MQTT 
const async = require('async');
const Sensor = require('../models/sensor');
const debug = require('debug')('lpg:index.js');



//once connected, subscribe on the MQTT broker 
client.once('connect', () => {
  debug('MQTT client connected.');
  client.subscribe('#', (err, granted) => {
    if (err) return debug(err);
    debug(`Connected to ${granted[0].topic}`);  //if granted, send response object
  });
});



/* GET home page. */
router.get('/', function (req, res, next) {
  Sensor.findOne({}, {
    logs: {
      $slice: -1           //reverse the order of the data 
    }
  }, 
  
  function (err, result) {   //unsuccessful render the error page
    if (err) return res.status(500).render('error', {
      error: err
    })
    console.log(result)
    res.render('index', {      //successful, render the homepage
      title: 'LPG Mon HOME',
      result: result.logs[0]     //return last log on the cards of the homepage
    });
  });

});




//Render the graph of gas concentration and time
router.get('/chartdata', (req, res) => {
  Sensor.findOne({}, {
    logs: {
      $slice: -10    //return the last ten objects 
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
          chart.data[key] = {    //defining the x and y axis
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



//making request to the client-database on homepage
router.get('/logs', function (req, res, next) {
  res.render('table', {
    title: 'Raw Data'
  });
});


//the client-database page make a request to get the log data
router.get('/tabledata', function (req, res) {
  Sensor.findOne({}, {
    logs: 1   //return only logs
  }).exec((err, result) => {
    if (err) return debug(err);
    res.json(result);
  });
});


//when sensor data arrives
router.get('/update', (req, res, next) => {
  let query = req.query;
  query.time_stamp = new Date();

  //publish to channel or serial no
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





//
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
    clearTimeout(timer);  //destroy the timer interval 18000 when the connection closes.
  });
});

module.exports = router;

client.on('error', err => {
  console.error(err);
  debug(err);
});