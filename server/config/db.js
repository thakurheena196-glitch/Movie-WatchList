const mongoose = require("mongoose");

module.exports.mongoConnect = () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then((mong) => {
      console.log("Connected to database successfully");
    })
    .catch((err) => {
      console.log(err);
      console.log("Connection failed");
    });
};
