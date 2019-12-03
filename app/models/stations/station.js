const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Device = require('../devices/device');
const StationUser = require('./station-user');

let station = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: { type: String, required: true },

  owner: String,

  location: String,

  phone: String,

  registration_no: String,

  number_of_tanks: Number,

  device: [{ type: Schema.Types.ObjectId, ref: 'Device', required: true }],

  station_user: {
    type: Schema.Types.ObjectId,
    ref: 'StationUser',
  },

  authority_branch: {
    type: Schema.Types.ObjectId,
    ref: 'AuthorityBranch',
  },
});

module.exports = mongoose.model('Station', station);
