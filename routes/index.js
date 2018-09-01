//Routes for index pages
const express = require("express");
const router = express.Router();

//bring in auth middleware
const { ensureAuthenticated } = require("./../helpers/auth");

//home page - welcome, some info
router.get("/", (req, res) => {
  res.render("index/welcome");
});

//user dashboard after a user logins in, redirect here
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  res.render("index/dashboard");
});

router.get("/about", (req, res) => {
  res.render("index/about");
});

module.exports = router;
