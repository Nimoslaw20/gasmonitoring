const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AuthorityUser = require('./authority-branch-user');
const Station = require('../stations/station');

let authorityBranch = new Schema({
  name: String,

  email: { type: String, required: true, unique: true },

  phone: String,

  reference_no: String,

  region: String,

  stations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Station',
      required: true,
    },
  ],

  authority_users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'AuthorityUser',
      required: true,
    },
  ],
});

module.exports = mongoose.model('AuthorityBranch', authorityBranch);
