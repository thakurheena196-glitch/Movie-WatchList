const routes = require("express").Router();

const { searchMovies, getMovieDetails } = require("./tbdb");

// ==============================
// TMDB APIs
// ==============================

routes.get("/movies/search", searchMovies);
routes.get("/movies/:tmdbId", getMovieDetails);

module.exports = routes;
