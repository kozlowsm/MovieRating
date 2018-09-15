//Bring in mongoose module
const mongoose = require("mongoose");
const keys = require("./../config/keys");

//Create the connection between the app and the local db
mongoose
  .connect(
    keys.mongoURI,
    {
      useNewUrlParser: true
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

//Export the connection for use in app.js
module.exports = { mongoose };
