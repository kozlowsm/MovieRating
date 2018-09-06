const express = require("express");
const axios = require("axios");
const keys = require("./../config/keys");
router = express.Router();

//global var for link to access api
const omdbURL = "https://www.omdbapi.com/?apikey=";

router.get("/search", (req, res) => {
  //get the movie title from the user
  let movieTitle = req.query.movieTitle;

  //search api with user movie title
  fetchPages(movieTitle);

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
});

router.get("/show/:id", (req, res) => {
  let movieID = req.params.id;
  axios
    .get(`${omdbURL}${keys.omdbKey}&i=${movieID}&plot=full`)
    .then(movie => {
      if (!movie.data.Response) return res.status(400).send("Invalid movie ID");
      let movieData = movie.data;
      console.log(movieData);
      res.render("movies/show", { movieData });
    })
    .catch(err => {
      res.status(400).send("Oops, something went wrong.");
    });
});

//takes the title of the movie to search and the number of pages you want to return
function fetchPages(movieTitle) {
  let pagesRequired = 0;
  let omdbResponse = await axios.get(
    `${omdbURL}${keys.omdbKey}&s=${movieTitle}&type=movie`
  );
  pagesRequired = Math.ceil(omdbResponse.data.totalResults / 10);
  const apiPromises = [];
  if (pagesRequired > 1) {
    for (let i = 0; i <= 2; i++) {
      apiPromises.push(
        axios.get(
          `${omdbURL}${keys.omdbKey}&s=${movieTitle}&type=movie&page=${i}`
        )
      );
    }
    Promise.all(apiPromises)
      .then(results => {
        results.forEach(result => {
          console.log(result);
        });
      });
  }
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
