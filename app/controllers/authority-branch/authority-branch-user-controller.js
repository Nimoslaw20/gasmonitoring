const authorityUser = require('../../models/authority-branch/authority-branch-user');
const colors = require('colors');
const colorScheme = require('../../../config/colors');
colors.enable();
colors.setTheme(colorScheme);

const authorityUserController = {
  read(req, res) {
    authorityUser
      .find({})
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
