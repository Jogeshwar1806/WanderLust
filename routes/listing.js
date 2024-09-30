const express = require("express");
const router = express.Router();
//require WrapAsync for error handling
const wrapAsync = require("../utils/wrapAsync.js");
//Listing is required
const Listing = require("../models/listing.js");
const { title } = require("process");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

//Index Listing Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
  })
);

//New Listing Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listing/new.ejs");
});

//Edit Listing Route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
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
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing Not Found!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listing/show.ejs", { listing });
  })
);

//Create Listing Route
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created Successfully!");
    res.redirect("/listings");
  })
);

//Update Listing Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
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
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
  })
);

module.exports = router;
