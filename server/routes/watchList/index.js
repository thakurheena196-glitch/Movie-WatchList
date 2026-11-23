const routes = require("express").Router();
const uploadPosterMiddleware = require("../../middlewares/uploadMiddleware");
const {
  createWatchlistItem,
  getWatchlist,
  getWatchlistItemById,
  updateWatchlistItem,
  uploadCustomPoster,
  deleteWatchlistItem,
} = require("./watchList");

// Watchlist APIs
routes.post("/watchlist", createWatchlistItem);
routes.get("/watchlist", getWatchlist);
routes.get("/watchlist/:id", getWatchlistItemById);
routes.patch("/watchlist/:id", updateWatchlistItem);
routes.post(
  "/watchlist/:id/poster",
  uploadPosterMiddleware.single("poster"),
  uploadCustomPoster,
);

routes.delete("/watchlist/:id", deleteWatchlistItem);

module.exports = routes;
