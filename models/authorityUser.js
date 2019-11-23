const mongoose = require('mongoose');
const AuthorityBranch = require('../models/authorityBranch');
const Schema = mongoose.Schema;

let authorityUser = new Schema({
  name: String,

  email: String,

  password: String,

  phone: String,

  role: String,

  reference: String,

  authority_branch: {
    type: Schema.Types.ObjectId,
    ref: 'AuthorityBranch',
  },
});

module.exports = mongoose.model('authorityUser', authorityUser);
