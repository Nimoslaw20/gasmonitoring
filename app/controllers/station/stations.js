const Station = require('../../models/stations/station');
const colors = require('colors');
const colorScheme = require('../../../config/colors');
colors.enable();
colors.setTheme(colorScheme);

const StationController = {
  /**
   *@apiVersion 0.0.1
   * @apiGroup Station
   * @api {GET} /station Get list of all stations
   * @apiSampleRequest   http://localhost:3000/api/v1/station
   * @apiParamExample {json} Request-Example:
   *     {
   *       "authorization": Bearer token
   *     }
   *  @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *
   *   {
   *          "message": "Station list",
   *           "success": true,
   *           "data": [
   *          {
   *            "name": "Royal Gas Group"
   *         },
   *        {
   *            "name": "Paradise Gas Group"
   *        },
   *        {
   *             "name": "Swiss Gas"
   *         },
   *         {
   *             "name": "Allied Gas"
   *          }
   *        ]
   *       }
   *
   *
   *
   * */
  read(req, res) {
    Station.find({}, { name: 1, _id: 0 })
      // .populate('device', 'ser_no')
      // .populate('station_user', 'name')
      .exec(function(err, data) {
        console.log(data);
        if (err) {
          console.log(`${err}`.error);
          res.status(500).json({
            message: 'error occurred',
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

  /**
   * @apiVersion 0.0.1
   * @apiGroup Station
   * @api {POST}  /station Creating a new station
   * @apiDescription
   * To fully create a new station, you will need to call the endpoint with a POST method.
   * @apiSampleRequest   http://localhost:3000/api/v1/station
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.1 200 OK
   *        {
   *            "message": "Station created successfully.",
   *            "success": true,
   *            "data": {
   *                    "device": [
   *                          "5ddc0fc2204df33906beeb03"
   *                            ],
   *             "_id": "5ddc0fcd204df33906beeb04",
   *             "name": "Fan Oil Gas Group",
   *             "email": "fogg@outlook.com",
   *             "location": "Asokwa",
   *             "registration_no": "FGHJ",
   *             "number_of_tanks": 2,
   *             "__v": 0
   *              }
   *           }
   *
   *
   *
   * */

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
              message: 'error occurred',
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

  /**
   *
   * @apiVersion 0.0.1
   * @apiGroup Station
   * @api {PATCH}  /station/:id
   * @apiDescription
   * To fully update a station field, you will need to call the endpoint with a PATCH method
   * @apiParam {String} id Station unique ID
   * @apiSampleRequest   http://localhost:3000/api/v1/station/5ddff97a6dd16b3782624fc4
   * @apiSuccessExample {json} Success-Response:
   *   HTTP/1.1 200 OK
   *   {
   *      "message": "Station updated successfully.",
   *      "success": true,
   *      "data": {
   *            "device": [
   *                       "5dda799aac23950c2afecab4"
   *                    ],
   *                "_id": "5dda827f458422106484202e",
   *                        "name": "Royal Gas Group",
   *                        "email": "royalgg@outlook.com",
   *                        "location": "Adenta",
   *                       "registration_no": "ASDF120",
   *                       "number_of_tanks": 2,
   *                       "__v": 0,
   *                  "station_user": "5dda893738dc1b134ba045a5",
   *      "owner": "Emmanuel Nimo"
   *     }
   *   }
   *
   * */
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
              message: 'error occurred',
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

  /**
   *
   * @apiVersion 0.0.1
   * @apiGroup Station
   * @api {DELETE}  station/:id  Deleting a station
   * @apiDescription
   * To fully delete a station , you will need to call the endpoint with a DELETE method using an id as a param.
   * @apiParam {String} id Station unique ID
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.0 200 OK
   *        {
   *           "message": "Station deleted successfully.",
   *           "success": true,
   *           "data": {
   *                    "device": [
   *                        "5ddc0fc2204df33906beeb03"
   *                     ],
   *     "_id": "5ddc0fcd204df33906beeb04",
   *     "name": "Fan Oil Gas Group",
   *     "email": "fogg@outlook.com",
   *     "location": "Asokwa",
   *     "registration_no": "FGHJ",
   *     "number_of_tanks": 2,
   *     "__v": 0,
   *     "authority": "5dda9436a64f1c1818e30cf6"
   *     }
   *  }
   *
   *
   *
   * */

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
          message: 'error occurred',
          success: false,
          error: err.message,
        });
      });
  },
};

module.exports = StationController;
