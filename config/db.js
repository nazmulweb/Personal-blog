const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    console.log("Mongo server connected ...");
  } catch (e) {
    console.log(e);
  }
};

// test server connection

// const testdb = mongoose.connection;

// testdb.on("error", err => {
//   console.log(err);
// });

// testdb.once("open", () => {
//   console.log("Server successfully connected");
// });

module.exports = connectDB;
