const express = require("express");
const router = express.Router();
//require WrapAsync for error handling
const wrapAsync = require("../utils/wrapAsync.js");
//Require listingSchema and reviewSchema from schema.js
const { listingSchema } = require("../schema.js");
//Listing is required
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const { title } = require("process");
const {isLoggedIn} = require("../middleware.js");

//created function which uses joi for error handling(form validation) for create a new listing
function validateListing(req, res, next) {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

//Index Listing Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
  })
);

//New Listing Route
router.get("/new",isLoggedIn, (req, res) => {
  res.render("listing/new.ejs");
});

//Edit Listing Route
router.get(
  "/:id/edit",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing Not Found!");
      res.redirect("/listings");
    }
    res.render("listing/edit.ejs", { listing });
  })
);

//Show Listing Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing Not Found!");
      res.redirect("/listings");
    }
    res.render("listing/show.ejs", { listing });
  })
);

//Create Listing Route
router.post(
  "/",isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
  })
);

//Update Listing Route
router.put(
  "/:id",isLoggedIn,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const newListing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    console.log("newListing", newListing);

    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Listing Route
router.delete(
  "/:id",isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
  })
);

module.exports = router;