const fs = require("fs");
const path = require("path");

const WatchlistItem = require("../models/watchListItem");
const tmdbService = require("../services/tmdbServices");

class WatchlistController {
  // Remove old custom poster
  static removeLocalFileIfCustom(item) {
    if (item.posterSource === "custom" && item.posterUrl) {
      const filename = path.basename(item.posterUrl);
      const filePath = path.join(__dirname, "..", "uploads", filename);

      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Failed to delete old poster:", err.message);
        }
      });
    }
  }

  static async createWatchlistItem(body) {
    const { tmdbId } = body;

    if (!tmdbId) {
      throw new Error("A valid numeric tmdbId is required.");
    }

    const existing = await WatchlistItem.findOne({
      tmdbId: Number(tmdbId),
    });

    if (existing) {
      throw new Error("This movie is already in your watchlist.");
    }

    const movieData = await tmdbService.getMovieDetails(Number(tmdbId));

    const newItem = await WatchlistItem.create({
      tmdbId: movieData.tmdbId,
      title: movieData.title,
      overview: movieData.overview,
      releaseDate: movieData.releaseDate,
      genres: movieData.genres,
      posterUrl: movieData.posterUrl,
      posterSource: "tmdb",
      status: "to_watch",
    });

    return newItem;
  }

  static async getWatchlist(query) {
    const { status, search } = query;

    const filter = {};

    if (status && ["to_watch", "watching", "done"].includes(status)) {
      filter.status = status;
    }

    if (search && search.trim()) {
      filter.title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    const items = await WatchlistItem.find(filter).sort({
      createdAt: -1,
    });

    return items;
  }

  static async getWatchlistItemById(id) {
    const item = await WatchlistItem.findById(id);

    if (!item) {
      throw new Error("Watchlist item not found.");
    }

    return item;
  }

  static async updateWatchlistItem(id, body) {
    const item = await WatchlistItem.findById(id);

    if (!item) {
      throw new Error("Watchlist item not found.");
    }

    const { status, rating, notes } = body;

    const nextStatus = status !== undefined ? status : item.status;

    if (!["to_watch", "watching", "done"].includes(nextStatus)) {
      throw new Error("Invalid watchlist status.");
    }

    if (rating !== undefined && rating !== null && rating !== "") {
      if (nextStatus !== "done") {
        throw new Error('Rating can only be set when status is "done".');
      }

      const numericRating = Number(rating);

      if (
        !Number.isFinite(numericRating) ||
        numericRating < 0 ||
        numericRating > 10
      ) {
        throw new Error("Rating must be between 0 and 10.");
      }

      item.rating = numericRating;
    } else if (rating === null || rating === "") {
      item.rating = null;
    }

    if (nextStatus !== "done") {
      item.rating = null;
    }

    item.status = nextStatus;

    if (notes !== undefined) {
      item.notes = notes;
    }

    await item.save();

    return item;
  }

  static async uploadCustomPoster(id, file) {
    if (!file) {
      throw new Error("No file received.");
    }

    const item = await WatchlistItem.findById(id);

    if (!item) {
      fs.unlink(file.path, () => {});
      throw new Error("Watchlist item not found.");
    }

    this.removeLocalFileIfCustom(item);

    item.posterUrl = `/uploads/${file.filename}`;
    item.posterSource = "custom";

    await item.save();

    console.log("Saved poster URL:", item.posterUrl);

    return item;
  }

  // 6. Delete watchlist item
  static async deleteWatchlistItem(id) {
    const item = await WatchlistItem.findById(id);

    if (!item) {
      throw new Error("Watchlist item not found.");
    }

    this.removeLocalFileIfCustom(item);

    await item.deleteOne();

    return {
      message: "Watchlist item deleted.",
    };
  }
}

module.exports = { WatchlistController };
