const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let StationUser = new Schema({
  name: String,

  email: String,

  password: String,

  phone: String,

  role: String,

  reference: String,
});

module.exports = mongoose.model('StationUser', StationUser);
