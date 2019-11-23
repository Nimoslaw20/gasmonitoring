const mongoose = require('mongoose');
const Station = require('../models/fillingStation');
const Schema = mongoose.Schema;

let Device = new Schema({
  ser_no: String,

  date_of_purchase: {
    type: Date,
  },

  date_of_expiry: {
    type: Date,
  },

  station: {
    type: Schema.Types.ObjectId,
    ref: 'Station',
  },
});

module.exports = mongoose.model('Device', Device);
