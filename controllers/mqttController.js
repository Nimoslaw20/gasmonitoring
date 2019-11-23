const debug = require('debug')('lpg:index.js');
const { connect } = require('mqtt');
const { mqtt } = require('../config/env');
const client = connect(mqtt.url, mqtt.options); // connect to MQTT

client.once('connect', () => {
  debug('MQTT client connected.');
  client.subscribe('#', (err, granted) => {
    if (err) return debug(err);
    debug(`Connected to ${granted[0].topic}`); //if granted acesss, send response object
  });
});

client.on('error', err => {
  console.error(err);
  debug(err);
});

module.exports = client;
