const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imdbRating: {
    type: String
  },
  runTime: {
    type: String
  },
  rating: {
    type: String
  },
  poster: {
    type: String
  },
  genre: {
    type: String
  },
  actors: {
    type: String
  },
  imdbID: {
    type: String,
    unique: true
  }
});

const Movie = mongoose.model("Movie", MovieSchema);

module.exports = { Movie };
