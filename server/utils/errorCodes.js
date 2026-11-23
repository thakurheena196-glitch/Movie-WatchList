const errorCodes = {
  "Something went wrong.": {
    statusCode: 500,
    error: "Internal server error.",
  },

  "Unauthorized access.": {
    statusCode: 401,
    error: "You are not authorized to perform this action.",
  },

  "Access denied.": {
    statusCode: 403,
    error: "Access denied.",
  },

  "Invalid request.": {
    statusCode: 400,
    error: "Invalid request.",
  },

  "A valid numeric tmdbId is required.": {
    statusCode: 400,
    error: "A valid numeric TMDB ID is required.",
  },

  "Search query parameter is required.": {
    statusCode: 400,
    error: "Search query parameter is required.",
  },

  'Rating can only be set when status is "done".': {
    statusCode: 400,
    error: "Rating can only be set when status is done.",
  },

  "Rating must be between 0 and 10.": {
    statusCode: 400,
    error: "Rating must be between 0 and 10.",
  },

  "Invalid watchlist status.": {
    statusCode: 400,
    error: "Invalid watchlist status.",
  },

  "Please select a valid image file (jpeg, png, or webp, max 2 MB).": {
    statusCode: 400,
    error: "Please select a valid image file (jpeg, png, or webp, max 2 MB).",
  },

  "This movie is already in your watchlist.": {
    statusCode: 409,
    error: "This movie is already in your watchlist.",
  },

  "Watchlist item not found.": {
    statusCode: 404,
    error: "Watchlist item not found.",
  },
};

module.exports = errorCodes;
