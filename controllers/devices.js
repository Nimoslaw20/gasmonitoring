var express = require('express');
const Device = require('../models/device');

const DeviceController = {
  list(req, res) {
    Device.find({})
      .populate('station')
      .exec(function(err, data) {
        if (err) {
          res.status(500).json({
            message: 'error occured',
            success: false,
            error: err.message,
          });
        } else {
          res.status(200).json({
            message: 'device list',
            success: true,
            data,
          });
        }
      });
  },

  create(req, res) {
    const body = new Device(req.body);
    Device.findOne({ ser_no: req.body.ser_no }).exec((err, response) => {
      if (!err && response) {
        res.status(409).json({
          message: 'Device already exists',
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
              message: 'Device create successfully.',
              success: true,
              data,
            });
          }
        });
      }
    });
  },

  update(req, res) {
    const body = new Device(req.body);
    Device.findOne({ _id: req.params.id }).exec((err, response) => {
      if (!err && response) {
        Device.findByIdAndUpdate(req.params.id, { $set: req.body })
          .then(response => {
            res.status(200).json({
              message: 'Device updated successfully.',
              success: true,
              data: response,
            });
          })
          .catch(err);
      } else {
        res.status(200).json({
          message: 'Device update failed.',
          success: true,
          data,
        });
      }
    });
  },

  delete(req, res) {
    const body = new Device(req.body);
    Device.findOne({ _id: req.params.id }).exec((err, response) => {
      if (!err && response) {
        Device.findByIdAndDelete(req.params.id).exec((err, data) => {
          if (!err) {
            res.status(200).json({
              message: 'Device deleted successfully.',
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

module.exports = DeviceController;
