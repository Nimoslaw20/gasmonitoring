const bcrypt = require('bcrypt');
const saltRounds = 10;
var config = require('../../../config/env');
const authorityUser = require('../../models/authority-branch/authority-branch-user');
var jsonwt = require('jsonwebtoken');
const colors = require('colors');
const colorScheme = require('../../../config/colors');
colors.enable();
colors.setTheme(colorScheme);

const authBranchController = {
  async login(req, res) {
    await authorityUser
      .findOne({ name: req.body.name })
      .then(response => {
        console.log(response);
        bcrypt.compare(
          req.body.password,
          response.password,
          async (err, result) => {
            if (err) {
              console.log(`${err}`.error);
            } else if (result === true) {
              const payload = {
                id: response.id,
                name: response.name,
              };
              var token = jsonwt.sign(payload, config.secret, {
                expiresIn: '3600s',
              });
              var refresh_token = jsonwt.sign(payload, config.secret);
              await authorityUser
                .findByIdAndUpdate(response.id, {
                  $set: {
                    refresh_token: refresh_token,
                  },
                })
                .exec();
              res.status(200).json({
                message: 'User Access Granted',
                success: true,
                token: 'Bearer ' + token,
                refresh_token: refresh_token,
              });
            } else {
              res.status(401).json({
                message: 'User unauthorized access',
                success: false,
              });
            }
          }
        );
        if (!response) {
          res.status(404).json({
            message: 'User does not exist',
            success: false,
          });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          message: 'an error occurred',
          success: false,
          error: err.message,
        });
      });
  },
};

module.exports = authBranchController;
