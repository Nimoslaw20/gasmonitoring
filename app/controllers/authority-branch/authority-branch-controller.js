const AuthorityBranch = require('../../models/authority-branch/authority-branch');
const colors = require('colors');
const colorScheme = require('../../../config/colors');
colors.enable();
colors.setTheme(colorScheme);

const authorityBranchController = {
  /**
   *
   * @apiVersion 0.0.1
   * @api {get} /authority Get authority branches
   * @apiDescription
   * To retrieve a list of all the authority branches you use the endpoint with a GET method
   * @apiGroup Authority branch
   * @apiSampleRequest http://localhost:3000/api/v1/authority
   * @apiSuccessExample {json} Success-Response:
   *    HTTP/1.1 200 0K
   *   {
   *      "message": "Authority branch list",
   *      "success": true,
   *       "data": [
   *                 {
   *                   "name": "PPA",
   *                   "region": "Greater Accra"
   *                 },
   *                 {
   *                    "name": "Gas Monitors",
   *                    "region": "Greater Accra"
   *                  }
   *                ]
   *   }
   */

  read(req, res) {
    AuthorityBranch.find({}, { name: 1, region: 1, _id: 0 })
      //.select('name', 'region')
      // .populate('station')
      // .populate('authority_user')
      .then(data => {
        console.log(`${data[0].name}`.info);
        res.status(200).json({
          message: 'Authority branch list',
          success: true,
          data,
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
  },

  /**
   *
   * @apiVersion 0.0.1
   * @api {post} /authority Creating new authority branch
   * @apiGroup Authority branch
   * @apiDescription
   * To create a new authority branch you will need to call the endpoint with the POST method.
   * @apiParam (Authority branch) {String} new authority branch
   * @apiSampleRequest http://localhost:3000/api/v1/authority
   * @apiSuccessExample {json} Success-Response
   *    HTTP/1.1 201 OK
   * {
   *  "message": "Authority Branch created successfully.",
   *  "success": true,
   *  "data": {
   *      "_id": "5dd94798a07be70c044f5f25",
   *     "name": "EPA",
   *     "email": "epa@gmail.com",
   *     "__v": 0
   *    }
   *  }
   *
   */

  async create(req, res) {
    const newAuth = new AuthorityBranch(req.body);
    let isAuthExists;
    try {
      isAuthExists = await AuthorityBranch.findOne({ email: req.body.email });
      if (isAuthExists)
        return res.status(409).json({
          message: 'Authority Branch already exists',
          success: false,
        });
      try {
        const authCreated = await newAuth.save();
        return res.status(201).json({
          message: 'Authority Branch created successfully.',
          success: true,
          data: authCreated,
        });
      } catch (err) {
        console.log(`${err}`.error);
        return res.status(500).json({
          message: 'error occured',
          success: false,
          error: err.message,
        });
      }
    } catch (err) {
      console.log(`${err}`.error);
      return res.status(500).json({
        message: 'error occured',
        success: false,
        error: err.message,
      });
    }
  },

  /**
   * @apiVersion 0.0.1
   * @api {patch} /authority/:id Updating an authroity branch with array as field eg. station, authority user.
   * @apiGroup Authority branch
   * @apiDescription
   * To update an authority branch you need to call the endpoint with a patch method
   * @apiParam (Authority branch) {String} stationId Unique id of the station in the authority branch.
   * @apiSampleRequest http://localhost:3000/api/v1/authority/5ddaa25337cc1f2044cc8da6
   * @apiParamExample {json} Request-Example:
   *  {
   *    "station":"5dda827f458422106484202e"
   *  }
   *
   * @apiSuccessExample {json} Success-Response:
   * HTTP/1.1 200 OK
   * {
   *  "message": "Authority Branch updated successfully.",
   *  "success": true,
   *  "data": {
   *     "station": [
   *         "5dda827f458422106484202e",
   *     ],
   *     "authority_user": [
   *         "5dd93f6a8a7bca07b0ac905c",
   *     ],
   *     "_id": "5ddaa25337cc1f2044cc8da6",
   *     "name": "Gas Monitors",
   *     "email": "gas@outlook.com",
   *     "phone": "+234553",
   *     "region": "Greater Accra",
   *    "__v": 0
   *   }
   * }
   */

  async update(req, res) {
    let idExist;
    try {
      idExist = await AuthorityBranch.findOne({ _id: req.params.id });
      if (idExist) {
        AuthorityBranch.findByIdAndUpdate(
          req.params.id,
          { $push: req.body },
          { new: true }
        )
          .then(response => {
            res.status(200).json({
              message: 'Authority Branch updated successfully.',
              success: true,
              data: response,
            });
          })
          .catch(err => {
            console.log(`${err}`.error);
            res.status(422).json({
              message: 'error occurred',
              success: true,
            });
          });
      } else {
        console.log(`${err}`.error);
        res.status(404).json({
          message: 'Authority Branch not found.',
          success: true,
        });
      }
    } catch (err) {
      console.log(`${err}`.error);
      res.status(500).json({
        message: 'error occurred',
        success: true,
      });
    }
  },

  /**
   *
   * @apiVersion 0.0.1
   * @api {post} /authority/:id Updating a field in the authority branch
   * @apiGroup Authority branch
   * @apiDescription
   * To update a field in the authority branch
   * @apiParam (Authority branch) {String} id  Unique id of the authority branch.
   * @apiParamExample {json} Request-Example:
   *     {
   *       "id": 5ddc00542f0efc325c097274
   *     }
   * @apiSampleRequest http://localhost:3000/api/v1/authority/5dda9436a64f1c1818e30cf6
   * @apiSuccessExample {json} Success-Response:
   *     HTTP/1.1 200 OK
   *     {
   *  "message": "Authority Branch updated successfully.",
   *  "success": true,
   *  "data": {
   *      "station": [],
   *      "authority_user": [],
   *      "_id": "5dda9436a64f1c1818e30cf6",
   *      "name": "PPA",
   *      "email": "ppa@gmail.com",
   *      "phone": "+234567234",
   *      "region": "Greater Accra",
   *      "__v": 0
   *     }
   *  }
   */

  updateAFieldByInfo(req, res) {
    AuthorityBranch.findOne({ _id: req.params.id }).exec((err, response) => {
      console.log(`${response}`.info);
      if (!err && response) {
        AuthorityBranch.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        )
          .then(response => {
            res.status(200).json({
              message: 'Authority Branch updated successfully.',
              success: true,
              data: response,
            });
          })
          .catch(err => {
            console.log(`${err}`.error);
            res.status(422).json({
              message: 'error occurred',
              success: false,
            });
          });
      } else {
        console.log(`${response}`.info);
        res.status(200).json({
          message: 'Authority Branch update failed.',
          success: false,
          data: response,
        });
      }
    });
  },

  /**
   * @apiVersion 0.0.1
   * @apiGroup Authority branch
   * @api  {delete} /authority/:id Deleting an authority branch
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
    AuthorityBranch.findOne({ _id: req.params.id }).exec((err, response) => {
      if (!err && response) {
        AuthorityBranch.findByIdAndDelete(req.params.id).exec((err, data) => {
          if (!err) {
            res.status(204).json({
              message: 'Authority deleted successfully.',
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

module.exports = authorityBranchController;
