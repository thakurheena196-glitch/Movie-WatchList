const { sendSuccessResponse } = require("../../services/sendResponse");
const { sendErrorResponse } = require("../../services/errorResponse");
const { TmdbController } = require("../../controllers/tmdbController");

async function searchMovies(req, res) {
  try {
    const { query, page = 1 } = req.query;

    const data = await TmdbController.searchMovies(query, page);

    return sendSuccessResponse(200, data, res);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

async function getMovieDetails(req, res) {
  try {
    const { tmdbId } = req.params;

    const data = await TmdbController.getMovieDetails(tmdbId);

    return sendSuccessResponse(200, data, res);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

module.exports = {
  searchMovies,
  getMovieDetails,
};
