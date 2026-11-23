const mongoose = require("mongoose");

class HealthController {
  static async getHealth() {
    const readyStates = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    const stateCode = mongoose.connection.readyState;

    const response = {
      status: "ok",
      uptime: process.uptime(),
      db: readyStates[stateCode] || "unknown",
      timestamp: new Date().toISOString(),
    };

    return response;
  }
}

module.exports = { HealthController };
