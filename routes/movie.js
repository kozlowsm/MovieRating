const express = require("express");
const axios = require("axios");
const keys = require("./../config/keys");
router = express.Router();

//auth helper
const { ensureAuthenticated } = require("./../helpers/auth");

//mongo models
const { Movie } = require("./../models/movie");
const { Rating } = require("./../models/rating");

//global var for link to access api
const omdbURL = "https://www.omdbapi.com/?apikey=";

router.get("/search", (req, res) => {
  //get the movie title from the user
  let movieTitle = req.query.movieTitle;
  console.log(movieTitle);

  let processed = [];

  //search api with user movie title
  /*  fetchPages(movieTitle)
    .then(results => {
      results.forEach(result => {
        console.log(result.data);
      });
    })
    .catch(err => console.log(err)); */
  if (movieTitle) {
    axios
      .get(`${omdbURL}${keys.omdbKey}&s=${movieTitle}&type=movie`)
      .then(movies => {
        //maybe flash a message and redirect back to search page/dashboard
        //console.log(movies);
        if (!movies.data.Response)
          return res.status(400).send("No movies found.");

        let movieData = movies.data;
        console.log(movieData);
        res.render("movies/results", { movieData });
      })
      .catch(err => {
        res.status(400).send("Oops, something went wrong.");
      });
  } else {
    res.render("movies/results");
  }
});

//show the specific movie and add its details to the database
router.get("/show/:id", (req, res) => {
  let movieID = req.params.id;
  axios
    .get(`${omdbURL}${keys.omdbKey}&i=${movieID}`)
    .then(movie => {
      if (!movie.data.Response) return res.status(400).send("Invalid movie ID");
      let movieData = movie.data;

      //add conditional to check if movie already in db
      let movieInfo = new Movie({
        title: movie.data.Title,
        imdbRating: movie.data.imdbRating,
        runTime: movie.data.Runtime,
        rating: movie.data.Rated,
        poster: movie.data.Poster,
        genre: movie.data.Genre,
        actors: movie.data.Actors,
        imdbID: movie.data.imdbID
      });
      //add the movie details to the collection
      movieInfo.save();

      res.render("movies/show", { movieData });
    })
    .catch(err => {
      res.status(400).send("Oops, something went wrong.");
    });
});

//Rating Post route - sends user rating to the database
router.post("/rate/:id", ensureAuthenticated, (req, res) => {
  let movieID = req.params.id;
  //Get the rating info from the user
  let userRating = req.body.rating; //add validation later!
  let userComment = req.body.comment;

  //add user data to rating collection
  Movie.findOne({ imdbID: movieID })
    .then(movieDB => {
      let newRating = new Rating({
        user: req.user._id,
        rating: userRating,
        comment: userComment,
        movieID: movieDB._id
      });
      newRating.save().then(rating => {
        res.redirect("/dashboard");
      });
    })
    .catch(err => console.log(err));
});

//takes the title of the movie to search and the number of pages you want to return
function fetchPages(movieTitle) {
  let pagesRequired = 0;
}

function fetchMetaData(movieTitle) {
  let pagesRequired = 0;
  axios
    .get(`${omdbURL}${keys.omdbKey}&s=${movieTitle}&type=movie`)
    .then(movies => {
      const apiPromises = [];
      pagesRequired = Math.ceil(movies.data.totalResults / 10);
      if (pagesRequired > 1) {
        for (let i = 1; i <= 2; i++) {
          apiPromises.push(
            axios.get(
              `${omdbURL}${keys.omdbKey}&s=${movieTitle}&type=movie&page=${i}`
            )
          );
        }

        Promise.all(apiPromises).then(responses => {
          const processedResponses = [];
          responses.map(response => {
            processedResponses.push(response);
          });

          return processedResponses;
        });
      }
    });
}

module.exports = router;
