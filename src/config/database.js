const mongoose = require("mongoose");


async function main() {
  await mongoose.connect("mongodb+srv://saurav:T6VV3uqypkRoPlE4@cluster0.z8zp5.mongodb.net/divTinder");
}

module.exports = main;
