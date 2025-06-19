const express = require("express");
const { body } = require("express-validator");

const User = require("../models/user.js");
const authController = require("../controllers/auth.js");

const router = express.Router();

router.put(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Pls enter a vaild email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail already Exists!");
          }
        });
      })
      .normalizeEmail(),
    body("password").trim().isLength({ min: 5 }),
    body("name").trim().not().isEmpty(),
  ],
  authController.signup
);

router.post('/login', authController.login);



module.exports = router;
