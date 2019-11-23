var express = require('express');
var router = express.Router();
const moment = require('moment');
const client = require('../controllers/mqttController');
const async = require('async');
const Sensor = require('../models/sensor');

const Station = require('../models/fillingStation');
const Device = require('../models/device');

//once MQTT is connected, subscribe to the MQTT broker

// /* GET home page. */
// router.get('/', function (req, res, next) {
//   Sensor.findOne({}, {
//     logs: {
//       $slice: -1           //in the reverse the order of the data  collected in the database
//     }
//   },

//   function (err, result) {   //unsuccessful render the error hbs
//     if (err) return res.status(500).render('error', {
//       error: err
//     })
//     // console.log(result)
//     if(result) return res.render('index', {      //successful, render the index hbs
//       title: 'LPG Mon HOME',
//       result: result.logs[0]     //when there is data
//     });
//     res.render('index',{
//       title: 'LPG Mon HOME',     //return the hompage when there is no data.
//       result: []
//     })
//   });

// });

// //Render the graph of gas concentration and time
// router.get('/chartdata', (req, res) => {
//   Sensor.findOne({}, {
//     logs: {
//       $slice: -10    //return the last ten objects
//     }
//   }).exec((err, logs) => {
//     if (err) return res.send(err);
//     var chart = {
//       chart: {
//         caption: 'Concentration of LPG',
//         subCaption: 'In PPM (parts per million)',
//         xAxisName: 'Time',
//         yAxisName: 'Concentration',
//         theme: 'fusion'
//       },
//       data: []
//     };
//     if (logs) return async.forEachOf(
//       logs.logs,
//       (value, key, callback) => {
//         try {
//           chart.data[key] = {    //defining the x and y axis
//             label: moment(value.time_stamp).fromNow('m'),
//             value: value.concentration
//           };
//         } catch (e) {
//           return callback(e);
//         }
//         callback();
//       },
//       err => {
//         if (err) return res.status(500).send(err);
//         res.json(chart);
//       }
//     );
//     res.json(chart);
//   });
// });

//making request to the client-database on homepage
router.get('/logs', function(req, res, next) {
  res.render('table', {
    title: 'Raw Data', //rendering table.hbs
  });
});

// //the client-database page make a request to get the log data
// router.get('/tabledata', function (req, res) {
//   Sensor.findOne({}, {
//     logs: 1   //return only logs
//   }).exec((err, result) => {
//     if (err) return debug(err);
//     res.json(result);
//   });
// });

router.get('/stream', (req, res) => {
  req.socket.setTimeout(Number.MAX_SAFE_INTEGER);
  // req.socket.setTimeout((i *= 6));
  //Set the response HTTP header with HTTP status and Content type
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
    clearTimeout(timer); //destroy the timer interval 18000 when the connection closes.
  });
});

//get filling stations
router.get('/stations', (req, res) => {
  Station.find({}).exec(function(err, data) {
    if (err) {
      console.log('Error:', err);
    } else {
      res.json(data);
    }
  });
});

// router.get('/devices',(req,res)=>{
//   Device.find({}).exec(function(err, data){
//     if(err){
//       console.log("Error:", err);
//     } else {
//       res.json(data);
//     }
//   })
// } );

router.post('/createStation', (req, res, next) => {
  Station.create(req.body)
    .then(result => {
      return result;
    })
    .then(station => res.json(station))
    .catch(next);
});

module.exports = router;
