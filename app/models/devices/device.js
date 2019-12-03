const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Device = new Schema({
  ser_no: { type: String, required: true },

  date_of_purchase: {
    type: Date,
  },

  last_online: {
    type: Date,
  },

  date_of_expiry: {
    type: Date,
  },

  logs: [
    {
      humidity: Number,
      temperature: Number,
      concentration: Number,
      time_stamp: Date,
    },
  ],
});

module.exports = mongoose.model('Device', Device);
