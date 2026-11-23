const routes = require("express").Router();
const healthRoutes = require("./health/index");
const tmdbRoutes = require("./tndb/index");
const watchlistRoutes = require("./watchList/index");

routes.use("/", healthRoutes);
routes.use("/api", tmdbRoutes);
routes.use("/api", watchlistRoutes);

module.exports = routes;
