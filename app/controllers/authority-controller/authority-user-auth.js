const bcrypt = require('bcrypt');
const saltRounds = 10;
var config = require('../../../config/env');
const user = require('../../models/authority/authority-user');
var jsonwt = require('jsonwebtoken');
const colors = require('colors');
const colorScheme = require('../../../config/colors');
colors.enable();
colors.setTheme(colorScheme);
const rand = require('rand-token');

const authController = {
  /**
   *
   * @apiName signup
   * @apiVersion 0.0.1
   * @apiGroup Authority user.
   * @api {POST} /authority/user/signup signup
   * @apiDescription
   * To create a new sign up for a user you will need to call the endpoint with a post method
   * @apiParam (Authority user) {String} name  mandatory user name
   * @apiParam (Authority user) {String} password mandatory user password
   * @apiSampleRequest http://localhost:3000/api/v1/authority/user/signup
   * @apiParamExample {json} Request-Example:
   *  {
   *     "name": "Jack Zack",
   *     "password":"tuh200"
   *  }
   *
   * @apiSuccessExample {json} Success-Response:
   *   HTTP/1.1 201 OK
   *  {
   *    "message": "User signed up!",
   *    "success": true,
   *    "data": {
   *      "_id": "5ddfbdabcd63ef19c363988b",
   *     "name": "Jack Zack",
   *     "password": "$2b$10$ff.gFNYe9KnodUWQwrZLT.qPb5vMzpVwT8opxohsrYhNV2qU9e2p6",
   *     "__v": 0
   *   }
   *  }
   *
   */

  async signup(req, res) {
    var newUser = new user({
      name: req.body.name,
      password: req.body.password,
    });
    await user
      .findOne({ name: newUser.name })
      .then(async response => {
        console.log(response);
        if (!response) {
          bcrypt.hash(newUser.password, saltRounds, async (err, hash) => {
            if (err) {
              console.log(`${err}`.error);
            } else {
              newUser.password = hash;
              await newUser
                .save()
                .then(() => {
                  res.status(201).json({
                    message: 'User signed up!',
                    success: true,
                    data: newUser.name,
                  });
                })
                .catch(err => {
                  console.log(`${err}`.error);
                  res.status(500).json({
                    message: 'an error occured',
                    success: false,
                    error: err.message,
                  });
                });
            }
          });
        } else {
          res.status(409).json({
            message: 'User already exist!',
            success: false,
            data: response.name,
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          message: 'an error occurred',
          success: false,
          error: err.message,
        });
        console.log(err);
      });
  },

  /**
   * @apiName login
   * @apiGroup Authority user
   * @apiVersion 0.0.1
   * @api {post} /authority/user/login login
   * @apiDescription
   * To login, you will need to call the endpoint with a post method
   * @apiParam (Authority user) {String} name  mandatory user name
   * @apiParam (Authority user) {String} password mandatory user password
   * @apiSampleRequest http://localhost:3000/api/v1/authority/user/login
   * @apiParamExample {json} Request-Example:
   *  {
   *      "name": "Emmanuel Nimo",
   *      "password": "ASDF300"
   *  }
   * @apiSuccessExample {json} Success-Response:
   *   HTTP/1.1 200 OK
   *    {
   *      "message": "User Access Granted",
   *      "success": true,
   *      "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkZGMyODc2MWIzNzdhNGFkYmI1YWQxNiIsIm5hbWUiOiJFbW1hbnVlbCBOaW1vIiwiaWF0IjoxNTc0ODkzMzc5LCJleHAiOjE1NzQ4OTY5Nzl9.yFoIoxHn83KW69jiVSvkt9BCtIw7vUIcJFLsJP_-TAw"
   *   }
   *
   *
   */
  async login(req, res) {
    await user
      .findOne({ name: req.body.name })
      .then(response => {
        console.log(response);
        bcrypt.compare(
          req.body.password,
          response.password,
          async (err, result) => {
            if (err) {
              console.log(`${err}`.error);
            } else if (result == true) {
              const payload = {
                id: response.id,
                name: response.name,
              };
              var token = jsonwt.sign(payload, config.secret, {
                expiresIn: '3600s',
              });
              var refresh_token = rand.uid(256);
              res.status(200).json({
                message: 'User Access Granted',
                success: true,
                token: 'Bearer ' + token,
                refresh_token: refresh_token,
              });
            } else {
              res.status(401).json({
                message: 'User unauthrorized access',
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
          message: 'error occurred',
          success: false,
          error: err.message,
        });
      });
  },
};

module.exports = authController;
