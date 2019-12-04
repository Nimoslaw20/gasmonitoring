const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
  name: {
    type: String,
    required: true,
    index: { unique: true },
  },
  password: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  refresh_token: {
    type: String,
    required: false,
    default: null,
  },
});

module.exports = mongoose.model('Users', user);
