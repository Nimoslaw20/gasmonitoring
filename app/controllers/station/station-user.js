const stationUser = require('../../models/stations/station-user');
const colors = require('colors');
const colorScheme = require('../../../config/colors');
colors.enable();
colors.setTheme(colorScheme);

const stationUserController = {
  /**
   * @apiVersion 0.0.1
   * @apiGroup Station User
   * @api {GET} /station/user  Get list of station users
   * @apiDescription
   * To retrieve the list of all station users, you will need to call the endpoint with a GET method.
   * @apiSampleRequest   http://localhost:3000/api/v1/station/user
   * @apiSuccessExample {json} Success-Response:
   *   HTTP/1.1 200 OK
   *     {
   *        "message": "Station users list",
   *        "success": true,
   *        "data": [
   *         {
   *         "name": "Abena Serwaa"
   *        },
   *        {
   *         "name": "Efia Akoto"
   *        }
   *       ]
   *     }
   *
   *
   * */
  read(req, res) {
    stationUser
      .find({}, { name: 1, _id: 0 })
      //.populate('station', ['name', 'location', 'owner'])
      .exec(function(err, data) {
        if (err) {
          res.status(500).json({
            message: 'an error occurred',
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

  /**
   * @apiVersion 0.0.1
   * @apiGroup Station User
   * @api {POST} /station/user  Creating new station user
   * @apiDescription
   * To create a new station user, you will need to call the endpoint with a POST method
   * @apiParam {String} user-details details of station user.
   * @apiSampleRequest   http://localhost:3000/api/v1/station/user
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 201 OK
   *    {
   *          "message": "Station user created successfully.",
   *          "success": true,
   *          "data": {
   *                   "_id": "5ddffa6d07a00438171ec0a1",
   *                   "name": "Zack Wells ",
   *                   "email": "zakw@gmail.com",
   *                   "password": "HJ4590",
   *                   "phone": "233425623456",
   *                   "role": "Manager",
   *                   "station": "5dda827f458422106484202e",
   *                  "__v": 0
   *      }
   *    }
   * */

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
              message: 'an error occurred',
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

  /**
   * @apiVersion 0.0.1
   * @apiGroup Station User
   * @api {PATCH}  /station/user/:id Updating a station user
   * @apiDescription
   * To update a station user details, you will call th endpoint with a PATCH method
   * @apiParam {String} id Station users unique ID
   * @apiSampleRequest   http://localhost:3000/api/v1/station/user/5ddc0e474f74423888047a1b
   * @apiRequestExample {json} Request-Example:
   *     {
   *       "role": "Dispenser Assistant"
   *     }
   * @apiSuccessExamples {json} Success-Response:
   *  HTTP/1.1 200 OK
   *  {
   *      "message": "Station updated successfully.",
   *       "success": true,
   *       "data": {
   *                 "_id": "5ddc0e474f74423888047a1b",
   *                 "name": "Efia Akoto",
   *                 "email": "ef@gmail.com",
   *                 "password": "GBN90",
   *                 "phone": "02467809089",
   *                 "role": "Manager",
   *                 "station": "5dda827f458422106484202e",
   *                "__v": 0
   *               }
   *         }
   *
   * */
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

  /**
   *
   * @apiVersion 0.0.1
   * @apiGroup Station User
   * @api {DELETE}  station/user/:id  Deleting a station user
   * @apiDescription
   * To fully delete a station user, you will need to call the endpoint with a DELETE method using an id as a param.
   * @apiParam {String} id Station users unique ID
   * @apiSuccessExample {json} Success-Response:
   *  HTTP/1.0 200 OK
   *   {
   *         "message": "Station user deleted successfully.",
   *         "success": true,
   *         "data": {
   *                  "_id": "5ddffa6d07a00438171ec0a1",
   *                  "name": "Zack Wells ",
   *                  "email": "zakw@gmail.com",
   *                  "password": "HJ4590",
   *                  "phone": "233425623456",
   *                  "role": "Manager",
   *                  "station": "5dda827f458422106484202e",
   *                  "__v": 0
   *               }
   *             }
   *
   *
   *
   * */
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
              message: 'an error occurred.',
              success: false,
              error: err.message,
            });
          }
        });
      } else {
        res.status(500).json({
          message: 'an error occurred.',
          success: false,
          error: err.message,
        });
      }
    });
  },
};

module.exports = stationUserController;
