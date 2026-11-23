const { searchMovies, getMovieDetails } = require("../services/tmdbServices");

class TmdbController {
  // 1. Search Movies
  static async searchMovies(query, page = 1) {
    if (!query) {
      throw new Error("Query parameter is required for searching movies.");
    }
    const data = await searchMovies(query.trim(), Number(page) || 1);

    return data;
  }

  // 2. Get Movie Details
  static async getMovieDetails(tmdbId) {
    if (!tmdbId || !Number.isFinite(Number(tmdbId))) {
      throw new Error("A valid numeric tmdbId is required.");
    }

    const movie = await getMovieDetails(tmdbId);

    return movie;
  }
}

module.exports = { TmdbController };
