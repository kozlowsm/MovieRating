const mongoose = require("mongoose");

const RatingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  rating: {
    type: String,
    require: true
  },
  comment: {
    type: String,
    required: true
  },
  movieID: {
    type: mongoose.Schema.Types.ObjectId, //make movie database
    ref: "Movie"
  }
});

const Rating = mongoose.model("Rating", RatingSchema);

module.exports = { Rating };
