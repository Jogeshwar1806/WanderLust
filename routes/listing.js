const express = require("express");
const router = express.Router();
//require WrapAsync for error handling
const wrapAsync = require("../utils/wrapAsync.js");
//Listing is required
const Listing = require("../models/listing.js");
const { title } = require("process");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

//Index Listing Route
router.get(
  "/",
  wrapAsync(listingController.index)
);

//New Listing Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Edit Listing Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm));

//Show Listing Route
router.get(
  "/:id",
  wrapAsync(listingController.showListing)
);

//Create Listing Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(listingController.createListing)
);

//Update Listing Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

//Delete Listing Route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;
