const Device = require('../models/devices/device');
const colors = require('colors');
const colorScheme = require('../../config/colors');
colors.enable();
colors.setTheme(colorScheme);

const DeviceController = {
  /**
   *
   * @apiVersion 0.0.1
   * @apiGroup Device
   * @apiDescription
   * To retrieve a list of all devices, you will need to call this endpoint with a GET method
   * @api {GET} /device Get list of devices
   * @apiSampleRequest   http://localhost:3000/api/v1/device
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *           "message": "device list",
   *           "success": true,
   *           "data": [
   *                     {
   *                        "ser_no": "DDP200"
   *                      },
   *                     {
   *                        "ser_no": "ERN300"
   *                      },
   *                     {
   *                        "ser_no": "ASH500"
   *                      },
   *                   {
   *                        "ser_no": "ASH200"
   *                    },
   *                  ]
   *                  }
   *
   *
   *
   *
   *
   * */
  read(req, res) {
    Device.find({}, { ser_no: 1, _id: 0 }).exec(function(err, data) {
      if (err) {
        res.status(500).json({
          message: 'error occurred',
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

  /**
   *
   * @apiVersion 0.0.1
   * @apiGroup Device
   * @apiDescription
   * To create a new device, you will need to call the endpoint with a POST method
   * @api {POST} /device  Creating a new device
   * @apiSampleRequest   http://localhost:3000/api/v1/device
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *        {
   *             "message": "Device create successfully.",
   *             "success": true,
   *             "data": {
   *                   "_id": "5ddffd7fe0504539e4ad4ee5",
   *                   "ser_no": "FGC100",
   *                  "date_of_purchase": "2018-12-10T00:00:00.000Z",
   *                   "last_online": "2020-01-01T00:00:00.000Z",
   *                  "date_of_expiry": "2022-12-10T00:00:00.000Z",
   *                   "logs": [],
   *                   "__v": 0
   *           }
   *        }
   *
   *
   * */
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
              message: 'error occurred',
              success: false,
              error: err.message,
            });
          } else {
            res.status(201).json({
              message: 'Device create successfully.',
              success: true,
              data,
            });
          }
        });
      }
    });
  },

  /**
   *
   * @apiVersion 0.0.1
   * @apiGroup Device
   * @api {PATCH}  /device/:id
   * @apiDescription
   * To fully update a device, you will need to call the endpoint with a PATCH method
   * @apiParam {String} id device unique ID
   * @apiSampleRequest   http://localhost:3000/api/v1/device/5dd7ff803aaa8e2be9b65dd2
   * @apiSuccessExample {json} Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *       "message": "Device updated successfully.",
   *       "success": true,
   *       "data": {
   *                 "_id": "5dd7ff803aaa8e2be9b65dd2",
   *                "ser_no": "wgft23",
   *               "station": "5dd819ff830fe5386be2474f",
   *              "date_of_purchase": "2019-12-10T00:00:00.000Z",
   *             "date_of_expiry": "2019-12-10T00:00:00.000Z",
   *                "__v": 0
   *              }
   *         }
   *
   * */

  update(req, res) {
    console.log(req.body);
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

  /**
   *
   * @apiVersion 0.0.1
   * @apiGroup Device
   * @api {DELETE}  device/:id  Deleting a device
   * @apiDescription
   * To fully delete a device , you will need to call the endpoint with a DELETE method using an id as a param.
   * @apiParam {String} id device unique ID
   *
   *
   * */
  delete(req, res) {
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
