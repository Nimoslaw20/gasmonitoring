const stationUser = require('../../models/stations/station-user');
const colors = require('colors');
const colorScheme = require('../../../config/colors');
colors.enable();
colors.setTheme(colorScheme);

const stationUserController = {
  read(req, res) {
    stationUser
      .find({})
      .populate('station', ['name', 'location', 'owner'])
      .exec(function(err, data) {
        if (err) {
          res.status(500).json({
            message: 'error occured',
            success: false,
            error: err.message,
          });
        } else {
          res.status(200).json({
            message: 'Station users list',
            success: true,
            data,
          });
        }
      });
  },

  create(req, res) {
    const body = new stationUser(req.body);
    stationUser.findOne({ email: req.body.email }).exec((err, response) => {
      if (!err && response) {
        res.status(409).json({
          message: 'Station user already exists',
          success: false,
        });
      } else {
        body.save((err, data) => {
          if (err) {
            res.status(500).json({
              message: 'error occured',
              success: false,
              error: err.message,
            });
          } else {
            res.status(201).json({
              message: 'Station user created successfully.',
              success: true,
              data,
            });
          }
        });
      }
    });
  },

  update(req, res) {
    stationUser.findOne({ _id: req.params.id }).exec((err, response) => {
      if (!err && response) {
        stationUser
          .findByIdAndUpdate(req.params.id, { $set: req.body })
          .then(response => {
            res.status(200).json({
              message: 'Station updated successfully.',
              success: true,
              data: response,
            });
          })
          .catch(err);
      } else {
        res.status(200).json({
          message: 'Station update failed.',
          success: true,
          data: response,
        });
      }
    });
  },

  delete(req, res) {
    stationUser.findOne({ _id: req.params.id }).exec((err, response) => {
      if (!err && response) {
        stationUser.findByIdAndDelete(req.params.id).exec((err, data) => {
          if (!err) {
            res.status(200).json({
              message: 'Station user deleted successfully.',
              success: true,
              data,
            });
          } else {
            res.status(500).json({
              message: 'error occurred.',
              success: false,
              error: err.message,
            });
          }
        });
      } else {
        res.status(500).json({
          message: 'error occurred.',
          success: false,
          error: err.message,
        });
      }
    });
  },
};

module.exports = stationUserController;
