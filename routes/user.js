const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
//require WrapAsync for error handling
const wrapAsync = require("../utils/wrapAsync.js");
//Require userSchema from models/user.js
const User = require("../models/user.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new User({ email, username });
      let registeredUser = await User.register(newUser, password);
      console.log(registeredUser);
      req.flash("success", "Welcome To WanderLust!");
      res.redirect("/listings");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  wrapAsync(async (req, res) => {
    let { username, password } = req.body;
    req.flash("success", "Welcome back to WonderLust !");
    res.redirect("/listings");
  })
);

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out!");
    res.redirect("/listings")
  });
});

module.exports = router;
