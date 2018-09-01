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
          // const movieData = [];
          // processedResponses.forEach(response => {
          //   movieData.concat(response.data.Search);
          //   console.log(response.data.Search);
          // });
          // console.log(movieData);
        });
      }
    });
}

module.exports = router;
