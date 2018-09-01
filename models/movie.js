const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imdbRating: {
    type: String
  },
  rottenRating: {
    type: String
  },
  runTime: {
    type: String
  },
  Rating: {
    type: String
  },
  poster: {
    type: String
  },
  actors: [
    {
      name: {
        type: String
      }
    }
  ]
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = { Movie };
