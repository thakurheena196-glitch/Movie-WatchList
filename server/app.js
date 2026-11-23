require("dotenv").config();

const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");

const routes = require("./routes/index");
const app = express();

const { mongoConnect } = require("./config/db");

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);

// IMPORTANT: Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect MongoDB
mongoConnect();

// API routes
app.use("/", routes);

// 404 handler (must be last)
app.use((req, res, next) => {
  next(createError(404));
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});

module.exports = {
  app,
};
