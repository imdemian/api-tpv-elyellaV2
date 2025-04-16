require("dotenv").config();
const mongoose = require("mongoose");

const URI = process.env.MONGO_URI;
mongoose.Promise = global.Promise;
mongoose.set("strictQuery", true);

mongoose
  .connect(URI)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((err) => {
    console.log("Database connection error: ", err);
  });

process.on("uncaughtException", (err, origin) => {
  console.error("Caught exception: " + err);
  console.error("Exception origin: " + origin);
});

module.exports = mongoose;
