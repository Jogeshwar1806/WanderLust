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
router.get("/new", (req, res) => {
  res.render("listing/new.ejs");
});

//Edit Listing Route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
  })
);

//Show Listing Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
  })
);

//Create Listing Route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Update Listing Route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const newListing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    console.log("newListing", newListing);
    res.redirect(`/listings/${id}`);
  })
);

//Delete Listing Route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

module.exports = router;