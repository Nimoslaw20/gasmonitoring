const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Device = require('../models/device');
const StationUser = require('../models/fillingStationUser');

let Station = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: { type: String, required: true },

  location: String,

  phone: String,

  registration_no: String,

  number_of_tanks: String,

  number_of_device: Number,

  reference: String,

  station_user: {
    type: Schema.Types.ObjectId,
    ref: 'StationUser',
  },
});

module.exports = mongoose.model('Station', Station);
