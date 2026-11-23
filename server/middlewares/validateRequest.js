const validateWatchlistUpdate = (req, res, next) => {
  const { status, rating, notes } = req.body;
  const allowedStatuses = ["to_watch", "watching", "done"];

  if (status !== undefined && !allowedStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be one of: to_watch, watching, done.",
    });
  }

  if (rating !== undefined && rating !== null && rating !== "") {
    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 10) {
      return res.status(400).json({
        success: false,
        message: "Rating must be an integer between 1 and 10.",
      });
    }
  }

  if (notes !== undefined && typeof notes === "string" && notes.length > 500) {
    return res.status(400).json({
      success: false,
      message: "Notes cannot exceed 500 characters.",
    });
  }

  next();
};

module.exports = {
  validateWatchlistUpdate,
};
