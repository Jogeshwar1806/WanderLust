const express = require("express");
const router = express.Router({ mergeParams: true });
//require WrapAsync for error handling
const wrapAsync = require("../utils/wrapAsync.js");
//Listing is required
const Listing = require("../models/listing.js");
//Review is Required
const Review = require("../models/review.js");

const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//Reviews Route
//Reviews-Post Route
//Creating new Review
router.post(
  "/",isLoggedIn,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//Delete Review Route
router.delete(
  "/:reviewId",isLoggedIn,isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
