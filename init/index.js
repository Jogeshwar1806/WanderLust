const mongoose = require("mongoose");
const initData = require("./sampleData.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("mongoose is working.");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "66f8fa0bc0316a09c589c566",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data has initialized");
};

initDB();
