const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const utilController = require("../controllers/utilController");
const authController = require("../controllers/auth");

router.post(
  "/register",
  [
    body("username", "Username is Required")
      .exists()
      .isString()
      .withMessage("Invalid Username"),
    body("first_name", "First Name Required")
      .exists()
      .isString()
      .withMessage("Invalid Name"),
    body("last_name", "Last Name Required")
      .exists()
      .isString()
      .withMessage("Invalid Name"),
    body("email", "Email is Required")
      .exists()
      .isEmail()
      .withMessage("Invalid Email"),
    body("phone_number", "Phone Number is Required")
      .exists()
      .isNumeric()
      .withMessage("Invalid Phone Number"),
    body("role").isIn(["seller", "buyer"]).withMessage("Invalid Role"),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/)
      .withMessage(
        "Password must contain at least one special character and a mix of alphanumeric characters"
      ),
  ],
  utilController.validateRequest,
  authController.registerUser
);

router.post(
  "/login",
  [
    body("identifier") // This can be either email or username
      .exists()
      .withMessage("Email or Username is required"),
    body("password").exists().withMessage("Password is required"),
  ],
  utilController.validateRequest,
  authController.login
);

module.exports = router;
