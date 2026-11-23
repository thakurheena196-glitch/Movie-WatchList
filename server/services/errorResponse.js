let errorCodes = require("../utils/errorCodes");

const sendErrorResponse = (error, res) => {
  let errorObj = errorCodes[error.message]
    ? errorCodes[error.message]
    : { statusCode: error.statusCode || 500, error: error.message };
  res.status(errorObj.statusCode).send({
    success: false,
    error: errorObj.error || error,
    errorCode: error.message || error.name || error,
  });
};

module.exports = {
  sendErrorResponse,
};
