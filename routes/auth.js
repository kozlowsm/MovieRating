const express = require("express");
const passport = require("passport");
const router = express.Router();

//login route, scope is the information we are asking to get from the user
//scope is provider specific
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//callback route required by google, if failure, redirect to home page
//if success, use res to do something, in this case go to the home page
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

//auth test route, not for production
router.get("/verify", (req, res) => {
  if (req.user) {
    console.log(req.user);
  } else {
    console.log("Not Authenticated.");
  }
});

//niffty little logout function on req provided by passport
//removes the req.user property and clears the login session
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
