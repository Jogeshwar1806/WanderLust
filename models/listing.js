const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHvEjQt4X571d6EPyE1OqjgBkSugPxRq5SpA&s",
    set: (v) =>
      v === ""
        ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHvEjQt4X571d6EPyE1OqjgBkSugPxRq5SpA&s"
        : v,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref:"User",
    
  }
});

//This will delete all the reviews related to listings.
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
