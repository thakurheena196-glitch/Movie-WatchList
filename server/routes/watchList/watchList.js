const { sendSuccessResponse } = require("../../services/sendResponse");
const { sendErrorResponse } = require("../../services/errorResponse");

const {
  WatchlistController,
} = require("../../controllers/watchlistController");

// 1. Create watchlist item
async function createWatchlistItem(req, res) {
  try {
    const { body } = req;

    const data = await WatchlistController.createWatchlistItem(body);

    return sendSuccessResponse(201, data, res);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

// 2. Get all watchlist items
async function getWatchlist(req, res) {
  try {
    const { query } = req;

    const data = await WatchlistController.getWatchlist(query);

    return sendSuccessResponse(200, data, res);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

// 3. Get watchlist item by ID
async function getWatchlistItemById(req, res) {
  try {
    const { params } = req;

    const data = await WatchlistController.getWatchlistItemById(params.id);

    return sendSuccessResponse(200, data, res);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

// 4. Update watchlist item
async function updateWatchlistItem(req, res) {
  try {
    const { body, params } = req;

    const data = await WatchlistController.updateWatchlistItem(params.id, body);

    return sendSuccessResponse(200, data, res);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

// 5. Upload custom poster
async function uploadCustomPoster(req, res) {
  try {
    const { params, file } = req;

    const data = await WatchlistController.uploadCustomPoster(params.id, file);

    return sendSuccessResponse(200, data, res);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

// 6. Delete watchlist item
async function deleteWatchlistItem(req, res) {
  try {
    const { params } = req;

    const data = await WatchlistController.deleteWatchlistItem(params.id);

    return sendSuccessResponse(200, data, res);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

module.exports = {
  createWatchlistItem,
  getWatchlist,
  getWatchlistItemById,
  updateWatchlistItem,
  uploadCustomPoster,
  deleteWatchlistItem,
};
