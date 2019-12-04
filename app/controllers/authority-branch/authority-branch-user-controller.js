const authorityUser = require('../../models/authority-branch/authority-branch-user');
const colors = require('colors');
const colorScheme = require('../../../config/colors');
colors.enable();
colors.setTheme(colorScheme);

const authorityUserController = {
  /**
   *
   * @apiVersion 0.0.1
   * @apiGroup Authority branch users
   * @api {GET}  /authority-branch/users Retrieving a list of Authority branch users
   * @apiDescription
   * To retrieve a list of all the authority branch users you use the endpoint with a GET method
   * @apiSampleRequest   http://localhost:3000/api/v1/authority-branch/users
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 200 0K
   * {
   *    "message": "Authority users list",
   *     "success": true,
   *     "data": [
   *            {
   *               "_id": "5dda92bfa64f1c1818e30cf1",
   *               "name": "Abigail Owusu",
   *               "authority_branch": {
   *               "_id": "5dda9436a64f1c1818e30cf6",
   *               "name": "PPA",
   *              "region": "Greater Accra"
   *            }
   *            },
   *           {
   *              "_id": "5ddc0c345522c23772d21641",
   *              "name": "Karl Baiden",
   *              "authority_branch": {
   *              "_id": "5dda9436a64f1c1818e30cf6",
   *              "name": "PPA",
   *              "region": "Greater Accra"
   *            }
   *            },
   *           {
   *              "_id": "5ddc0d6f5522c23772d21642",
   *              "name": "John Deere",
   *              "authority_branch": {
   *              "_id": "5dda9436a64f1c1818e30cf6",
   *              "name": "PPA",
   *              "region": "Greater Accra"
   *            }
   *           }
   *         ]
   *     }
   */

  read(req, res) {
    authorityUser
      .find({}, { name: 1, authority_branch: 1 })
      .populate('authority_branch', ['name', 'region'])
      .exec(function(err, data) {
        if (err) {
          res.status(500).json({
            message: 'error occured',
            success: false,
            error: err.message,
          });
        } else {
          res.status(200).json({
            message: 'Authority users list',
            success: true,
            data,
          });
        }
      });
  },

  /**
   *
   * @apiVersion 0.0.1
   * @apiGroup Authority branch users
   * @api {POST}  /authority-branch/users  Creating new authority branch user
   * @apiDescription
   * To create a new authority branch user, you will need to call the endpoint with the POST method.
   * @apiParam (Authority branch) {String} new authority branch user
   * @apiSampleRequest http://localhost:3000/api/v1/authority-branch/users
   *  HTTP/1.1 201 OK
   *
   *   {
   *       "message": "Authority user created successfully.",
   *       "success": true,
   *       "data": {
   *               "_id": "5ddc0c345522c23772d21641",
   *               "name": "Karl Baiden",
   *               "email": "kb@gmail.com",
   *                "password": "GH200er",
   *               "phone": "++233244563789",
   *               "reference": "THG389",
   *               "authority_branch": "5dda9436a64f1c1818e30cf6",
   *               "__v": 0
   *     }
   *  }
   *
   *
   *
   *
   */

  async create(req, res) {
    const newUser = new authorityUser(req.body);
    let isUserExists;
    try {
      isUserExists = await authorityUser.findOne({ email: req.body.email });
      if (isUserExists)
        return res.status(409).json({
          message: 'Authority user already exists',
          success: false,
        });
      try {
        const userCreated = await newUser.save();
        return res.status(201).json({
          message: 'Authority user created successfully.',
          success: true,
          data: userCreated,
        });
      } catch (err) {
        return res.status(500).json({
          message: 'error occured',
          success: false,
          error: err.message,
        });
      }
    } catch (err) {
      return res.status(500).json({
        message: 'error occured',
        success: false,
        error: err.message,
      });
    }
  },

  /**
   *
   * @apiVersion 0.0.1
   * @apiGroup Authority branch users
   * @api {PATCH}  /authority-branch/user/:id  Updating an authority branch user detail
   * @apiDescription
   * To update an authority branch you need to call the endpoint with a patch method
   * @apiParam (Authority branch users) {String} userId Unique id of the user in the authority branch.
   * @apiSampleRequest http://localhost:3000/api/v1/authority-branch/user/5ddc0c345522c23772d21641
   *    {
   *      "phone":"+233245678345"
   *    }
   * @apiSuccessExample {json} Success-Response:
   *      HTTP/1.1 200 OK
   *   {
   *       "message": "Authority user updated successfully.",
   *        "success": true,
   *        "data": {
   *                   "_id": "5ddc0c345522c23772d21641",
   *                   "name": "Karl Baiden",
   *                   "email": "kb@gmail.com",
   *                   "password": "GH200er",
   *                   "phone": "++233244563789",
   *                   "reference": "THG389",
   *                   "authority_branch": "5dda9436a64f1c1818e30cf6",
   *                   "__v": 0
   *             }
   *      }
   *
   *
   */

  update(req, res) {
    authorityUser.findOne({ _id: req.params.id }).exec((err, response) => {
      if (!err && response) {
        authorityUser
          .findByIdAndUpdate(req.params.id, { $set: req.body })
          .then(response => {
            res.status(200).json({
              message: 'Authority user updated successfully.',
              success: true,
              data: response,
            });
          })
          .catch(err);
      } else {
        res.status(200).json({
          message: 'Authority user update failed.',
          success: true,
          data: response,
        });
      }
    });
  },

  /**
   * @apiVersion 0.0.1
   * @apiGroup Authority branch user
   * @api  {delete} /authority-branch/user/:id Deleting an authority branch
   * @apiDescription
   * To delete an authority branch you will need to call the endpoint with a delete method
   * @apiParam (Authority branch) {String} Unique id of the authority branch.
   * @apiParamExample {json} Request-Example:
   *     {
   *       "id": 5ddc00542f0efc325c097274
   *     }
   * @apiSampleRequest http://localhost:3000/api/v1/authority/5ddc00542f0efc325c097274
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 204 OK
   */

  delete(req, res) {
    authorityUser.findOne({ _id: req.params.id }).exec((err, response) => {
      if (!err && response) {
        authorityUser.findByIdAndDelete(req.params.id).exec((err, data) => {
          if (!err) {
            res.status(200).json({
              message: 'Authority user deleted successfully.',
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

module.exports = authorityUserController;
