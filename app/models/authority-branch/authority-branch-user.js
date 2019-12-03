const mongoose = require('mongoose');
const AuthorityBranch = require('./authority-branch');
const Schema = mongoose.Schema;

let authorityUser = new Schema({
  name: String,

  email: { type: String, required: true, unique: true },

  password: String,

  phone: String,

  role: String,

  reference: String,

  authority_branch: {
    type: Schema.Types.ObjectId,
    ref: 'AuthorityBranch',
    required: true,
  },
});

module.exports = mongoose.model('AuthorityUser', authorityUser);
