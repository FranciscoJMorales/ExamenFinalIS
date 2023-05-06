const mongoose = require("mongoose");

async function connect() {
  console.log(process.env.DB_HOST);
  await mongoose.connect(
    `mongodb://${process.env.DB_HOST}/voting`
  );
  console.log("Database: Connected");
}

module.exports = { connect };