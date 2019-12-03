const Station = require('../../models/stations/station');
const colors = require('colors');
const colorScheme = require('../../../config/colors');
colors.enable();
colors.setTheme(colorScheme);

const StationController = {
  read(req, res) {
    Station.find({}, { name: 1 })
      // .populate('device', 'ser_no')
      // .populate('station_user', 'name')
      .exec(function(err, data) {
        console.log(data);
        if (err) {
          console.log(`${err}`.error);
          res.status(500).json({
            message: 'error occured',
            success: false,
            error: err.message,
          });
        } else {
          res.status(200).json({
            message: 'Station list',
            success: true,
            data,
          });
        }
      });
  },

  create(req, res) {
    const body = new Station(req.body);
    Station.findOne({ email: req.body.email }).exec((err, response) => {
      if (!err && response) {
        res.status(409).json({
          message: 'Station already exists',
          success: false,
        });
      } else {
        body.save((err, data) => {
          if (err) {
            console.log(`${err}`.error);
            res.status(500).json({
              message: 'error occured',
              success: false,
              error: err.message,
            });
          } else {
            res.status(201).json({
              message: 'Station created successfully.',
              success: true,
              data,
            });
          }
        });
      }
    });
  },

  update(req, res) {
    Station.findOne({ _id: req.params.id }).exec((err, response) => {
      if (!err && response) {
        Station.findByIdAndUpdate(req.params.id, { $set: req.body })
          .then(response => {
            res.status(200).json({
              message: 'Station updated successfully.',
              success: true,
              data: response,
            });
          })
          .catch(err => {
            console.log(`${err}`.error);
            res.status(500).json({
              message: 'error occured',
              success: false,
              error: err.message,
            });
          });
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
    Station.findOne({ _id: req.params.id }).exec((err, response) => {
      if (!err && response) {
        Station.findByIdAndDelete(req.params.id).exec((err, data) => {
          if (!err) {
            res.status(200).json({
              message: 'Station deleted successfully.',
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
        console.log(`${err}`.error);
        res.status(500).json({
          message: 'error occurred.',
          success: false,
          error: err.message,
        });
      }
    });
  },

  stationsPerAuthority(req, res) {
    Station.find({ authority_branch: req.params.id })
      .then(response => {
        if (!response) {
          res.status(404).json({
            message: 'No station found under this authority .',
            success: true,
            data: response,
          });
        } else {
          res.status(200).json({
            message: 'Stations under an authority.',
            success: true,
            data: response,
          });
        }
      })
      .catch(err => {
        console.log(`${err}`.error);
        res.status(500).json({
          message: 'error occurred',
          success: false,
          error: err.message,
        });
      });
  },

  stationUserPerAuthority(req, res) {
    Station.find(
      { authority_branch: req.params.id },
      { station_user: req.params.id }
    )
      .populate('station_user', 'name')
      .then(response => {
        if (!response) {
          res.status(404).json({
            message: 'Station user not found.',
            success: true,
            data: response,
          });
        } else {
          res.status(200).json({
            message: 'Station user found.',
            success: true,
            data: response,
          });
        }
      })
      .catch(err => {
        console.log(`${err}`.error);
        res.status(500).json({
          message: 'error occured',
          success: false,
          error: err.message,
        });
      });
  },
};

module.exports = StationController;
