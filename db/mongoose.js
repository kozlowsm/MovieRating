//Bring in mongoose module
const mongoose = require("mongoose");

//Create the connection between the app and the local db
mongoose
  .connect(
    "mongodb://127.0.0.1:27017/movieRating-dev",
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log(err));

//Export the connection for use in app.js
module.exports = { mongoose };
