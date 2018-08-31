//Passport configuration for google oauth2.0
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");
const keys = require("./keys");

//Bring in the user model
const { User } = require("./../models/user");

//define our strategy
module.exports = passport => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "http://localhost:3000/auth/google/callback",
        proxy: true
      },
      (accessToken, refreshToken, profile, done) => {
        //get the image and cut off the query
        const fullImage = profile.photos[0].value;
        const image = fullImage.substring(0, fullImage.indexOf("?"));

        //newUser object that we will send to database if new user
        const newUser = new User({
          googleID: profile.id,
          email: profile.emails[0].value,
          firstName: profile.name.givenName,
          image
        });

        //Check if the user already exists in the database
        User.findOne({ googleID: profile.id }).then(user => {
          //if a user exists with that id, send that user to the callback with done
          if (user) {
            done(null, user);
          } else {
            //create new user and add to database -> saved
            newUser.save().then(user => {
              //now that the user is saved, send it to the callback
              done(null, user);
            });
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
  });
};
