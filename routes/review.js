const express = require("express");
const router = express.Router({ mergeParams: true });
//require WrapAsync for error handling
const wrapAsync = require("../utils/wrapAsync.js");
//Listing is required
const Listing = require("../models/listing.js");
//Review is Required
const Review = require("../models/review.js");

const {validateReview} = require("../middleware.js");

//Reviews Route
//Reviews-Post Route
//Creating new Review
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created Successfully!");
    res.redirect(`/listings/${listing._id}`);
  })
);

//Delete Review Route
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted Successfully!");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
