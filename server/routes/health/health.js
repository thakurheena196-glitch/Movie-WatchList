const { sendSuccessResponse } = require("../../services/sendResponse");
const { sendErrorResponse } = require("../../services/errorResponse");

const { HealthController } = require("../../controllers/healthController");

async function getHealth(req, res) {
  try {
    const data = await HealthController.getHealth();

    return sendSuccessResponse(200, data, res);
  } catch (error) {
    return sendErrorResponse(error, res);
  }
}

module.exports = {
  getHealth,
};
