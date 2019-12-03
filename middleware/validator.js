const Joi = require('@hapi/joi');

const authPolicy = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(8)
      .required(),
    password: Joi.string()
      .alphanum()
      .min(5)
      .required(),
  });

  const { error, value } = schema.validate(req.body);

  console.log(value);
  if (error) {
    console.log(error);
    switch (error.details[0].context.key) {
      case 'name':
        res.status(422).json({
          message: 'Invalid User name!',
          success: false,
        });
        break;
      case 'password':
        res.status(422).json({
          message: 'Invalid password!',
          success: false,
        });
        break;
    }
  } else {
    next();
  }
};

module.exports = authPolicy;
