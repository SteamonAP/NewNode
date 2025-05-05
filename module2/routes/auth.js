const express = require("express");
const { check, validationResult, body } = require("express-validator");
const User = require("../models/user.js");
const authController = require("../controllers/auth");

const router = express.Router();

router.get("/signup", authController.getSignup);

router.post(
  "/signup",
  [
    check("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("E-Mail already exists.");
          }
        });
      })
      .normalizeEmail(),

    body("password", "Min password length 5").isLength({ min: 5 })
    .trim(),

    body("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords have to match!");
      }
      return true;
    }),
  ],
  authController.postSignup
);

router.get("/login", authController.getLogin);
router.post(
  "/login",
  [
    body("email", "Enter valid email").isEmail()
    .normalizeEmail(),
    body("password", "Minimum length 5 of password").isLength({ min: 5 })
    .trim()

  ],
  authController.postLogin
);
router.post("/logout", authController.postLogout);
router.get("/reset", authController.getReset);
router.post("/reset", authController.postReset);
router.get("/reset/:token", authController.getNewPassword);
router.post("/new-password", authController.postNewPassword);

module.exports = router;
