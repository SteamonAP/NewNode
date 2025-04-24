const crypto = require("crypto");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const dotenv = require("dotenv");
const { buffer } = require("stream/consumers");
dotenv.config();
// const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1];

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.API_KEY,
    },
  })
);

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    errorMessage: message,
  });
};

exports.posttLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }
          req.flash("error", "Invalid email or password");
          res.redirect("/login");
        })
        .catch((err) => {
          console.log(err);
          return res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};
exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
  });
};
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "E-Mail already exists");
        return res.redirect("/signup");
      }
      return bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const user = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return user.save();
        })
        .then((result) => {
          res.redirect("/login");
          return transporter.sendMail({
            to: email,
            from: "amoghpitale7@gmail.com",
            subject: "Signup succeeded!",
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
              <h2 style="color: #4CAF50; text-align: center;">🎉 Welcome to Our Shop!</h2>
              <p style="font-size: 16px; color: #333;">
                Hi there,
              </p>
              <p style="font-size: 16px; color: #333;">
                You’ve successfully created an account with us. We’re thrilled to have you onboard!
              </p>
              <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin-top: 20px;">
                <p style="font-size: 16px; color: #555;">
                  🚀 You can now explore and shop your favorite products. <br/>
                  💬 Got questions? Just reply to this email and we’ll be there to help.
                </p>
              </div>
              <p style="text-align: center; margin-top: 30px;">
                <a href="http://localhost:3000/login" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                  Go to Login
                </a>
              </p>
              <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
                © 2025 Our Shop. All rights reserved.
              </p>
            </div>
          `,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.posttLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No such Account was Found");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        transporter.sendMail({
          to: req.body.email,
          from: "amoghpitale7@gmail.com",
          subject: "Password Reset",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
              <h2 style="color: #4CAF50; text-align: center;"> Password Reset </h2>
              <p style="font-size: 16px; color: #333;">
                Hi there,
              </p>
              <p style="font-size: 16px; color: #333;">
                You’ve requested a password reset for your account on our Store!
              </p>
              <p style="text-align: center; margin-top: 30px;">Click here
                <a href="http://localhost:3000/reset/${token}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                  Reset Password
                </a>
                to set a new Password
              </p>
              <p style="font-size: 14px; color: #999; text-align: center; margin-top: 40px;">
                © 2025 Our Shop. All rights reserved.
              </p>
            </div>
          `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
