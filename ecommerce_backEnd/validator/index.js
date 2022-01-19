const { check, validationResult } = require("express-validator");

const userSignupValidationRules = () => {
  return [
    check("name", "Name is required")
      .notEmpty()
      .withMessage("Name can't be blank"),
    check("email", "Email must be between 10 to 30 characters")
      .matches(/.+\@.+\..+/)
      .withMessage("Email must conatin @")
      .isLength({ min: 10, max: 30 }),
    check("password", "Password minimun length 6 with atleast 1 digit")
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage("Password must contain atleast 6 characters.")
      .matches(/\d/)
      .withMessage("Password must conatin a number"),
  ];
};

const userSignupValidator = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({ errors: extractedErrors });
};

module.exports = { userSignupValidationRules, userSignupValidator };
