const Station = require('../models/fillingStation');

const StationController = {
  list(req, res) {
    Station.find({}).exec(function(err, data) {
      if (err) {
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
            res.status(500).json({
              message: 'error occured',
              success: false,
              error: err.message,
            });
          } else {
            res.status(200).json({
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
    const body = new Station(req.body);
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
    const body = new Station(req.body);
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
        res.status(500).json({
          message: 'error occurred.',
          success: false,
          error: err.message,
        });
      }
    });
  },
};

module.exports = StationController;
