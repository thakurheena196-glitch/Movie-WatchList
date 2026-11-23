const mongoose = require("mongoose");

const watchlistItemSchema = new mongoose.Schema(
  {
    tmdbId: {
      type: Number,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    overview: {
      type: String,
      default: "",
    },
    releaseDate: {
      type: String,
      default: "",
    },
    genres: {
      type: [String],
      default: [],
    },
    posterUrl: {
      type: String,
      default: "",
    },
    posterSource: {
      type: String,
      enum: ["tmdb", "custom"],
      default: "tmdb",
    },
    status: {
      type: String,
      enum: ["to_watch", "watching", "done"],
      default: "to_watch",
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
    },
    notes: {
      type: String,
      maxlength: 500,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("WatchlistItem", watchlistItemSchema);
