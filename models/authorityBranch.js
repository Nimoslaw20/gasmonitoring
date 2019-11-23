const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AuthorityUser = require('../models/authorityUser');

let authorityBranch = new Schema({
  name: String,

  email: String,

  phone: String,

  reference_no: String,

  region: String,

  authority_user: {
    type: Schema.Types.ObjectId,
    ref: 'AuthorityUser',
  },
});

module.exports = mongoose.model('authorityBranch', authorityBranch);
