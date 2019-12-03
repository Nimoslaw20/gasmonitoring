const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Station = require('./station');

let stationUser = new Schema({
  name: String,

  email: { type: String, required: true, unique: true },

  password: String,

  phone: String,

  role: String,

  station: {
    type: Schema.Types.ObjectId,
    ref: 'Station',
    required: true,
  },
});

module.exports = mongoose.model('StationUser', stationUser);
