// initializing express
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
let port = 8080;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

// initializing mongoose
const mongoose = require("mongoose");

main()
  .then(() => {
    console.log("mongoose is working.");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
}

//Listing is required
const Listing = require("./models/listing.js");
const { title } = require("process");

//Review is Required
const Review = require("./models/review.js");

//require WrapAsync for error handling
const wrapAsync = require("./utils/wrapAsync.js");

//Require ExpressError for error handling
const ExpressError = require("./utils/ExpressError.js");

//Require listingSchema and reviewSchema from schema.js
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");
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

//created function which uses joi for error handling(form validation) for Reviews for a list
function validateReview(req, res, next) {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
}

//This is root page
app.get("/", (req, res) => {
  res.send("Hey Root");
});

//Index Listing Route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listing/index.ejs", { allListings });
  })
);

//New Listing Route
app.get("/listings/new", (req, res) => {
  res.render("listing/new.ejs");
});

//Edit Listing Route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listing/edit.ejs", { listing });
  })
);

//Show Listing Route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs", { listing });
  })
);

//Create Listing Route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    console.log(newListing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Update Listing Route
app.put(
  "/listings/:id",
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
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

//Reviews Route
//Reviews-Post Route
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);

//Delete Review Route
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    // res.send("Hey this is the path.");
    res.redirect(`/listings/${id}`);
  })
);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!!"));
});

//middleware defining for handling the error
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Error Occured" } = err;
  res.status(statusCode).render("errors.ejs", { message });
});

app.listen(port, () => {
  console.log("The port 8080 is running.");
});
