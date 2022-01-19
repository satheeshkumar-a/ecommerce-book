const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  signout,
  requireSignin,
} = require("../controllers/auth");
const {
  userSignupValidationRules,
  userSignupValidator,
} = require("../validator");

router.post(
  "/signup",
  userSignupValidationRules(),
  userSignupValidator,
  signup
);

router.post("/signin", signin);
router.get("/signout", signout);

module.exports = router;
