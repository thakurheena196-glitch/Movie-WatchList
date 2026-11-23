const routes = require("express").Router();
const { getHealth } = require("./health");
routes.use("/health", getHealth);
module.exports = routes;
