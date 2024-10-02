const express = require("express");
const router = express.Router();
//require WrapAsync for error handling
const wrapAsync = require("../utils/wrapAsync.js");
//Listing is required
const Listing = require("../models/listing.js");
const { title } = require("process");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  //Index Listing Route
  .get(wrapAsync(listingController.index))
  // Create Listing Route
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//New Listing Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Edit Listing Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

router
  .route("/:id")
  //Show Listing Route
  .get(wrapAsync(listingController.showListing))
  //Update Listing Route
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  //Delete Listing Route
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;
