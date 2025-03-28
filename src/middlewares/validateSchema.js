import Joi from 'joi';

export const validateSchemaSignUp = (req, res, next) => {
  try {
    const schema = Joi.object({
      firstName: Joi.string().required().min(1).max(30).alphanum(),
      lastName: Joi.string().required().min(1).max(30).alphanum(),
      email: Joi.string().email().required().lowercase(),
      password: Joi.string()
        .required()
        .min(8)
        .max(30)
        .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
        .messages({
          'string.pattern.base':
            'Password must have at least 1 letter and 1 number.',
        }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation Failed!',
        errors: error.details.map((err) => err.message),
      });
    }

    return next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
export const validateSchemaSignIn = (req, res, next) => {
  try {
    const schema = Joi.object({
      email: Joi.string().email().required().lowercase(),
      password: Joi.string().required(),
    });

    // Validate Data
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation Failed!',
        errors: error.details.map((err) => err.message),
      });
    }
    next();
  } catch (err) {
    console.log(err);
  }
};
