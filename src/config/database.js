const mongoose = require("mongoose");


async function main() {
  await mongoose.connect("mongodb+srv://saurav:marine100@cluster0.z8zp5.mongodb.net/divTinder");
}

module.exports = main;
