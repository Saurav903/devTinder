const mongoose = require("mongoose");


async function main() {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
}

module.exports = main;
