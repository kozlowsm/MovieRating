//Routes for index pages
const express = require("express");
const router = express.Router();

//bring in auth middleware
const { ensureAuthenticated } = require("./../helpers/auth");

//models
const { Rating } = require("./../models/rating");
const { Movie } = require("./../models/movie");
const { User } = require("./../models/user");

//home page - welcome, some info
router.get("/", (req, res) => {
  res.render("index/welcome");
});

//user dashboard after a user logins in, redirect here
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  console.log(req.user);
  Rating.find({ user: req.user._id })
    .populate("movieID")
    .then(movies => {
      console.log(movies);
      res.render("index/dashboard", { movies });
    })
    .catch(err => console.log(err));
});

router.get("/about", (req, res) => {
  res.render("index/about");
});

module.exports = router;
