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

//require cookie-parser
const cookieParser = require("cookie-parser");

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

//Router is required for Routing the websites (for listings)
const listings = require("./routes/listing.js");

//Router is required for Routing the websites (for reviews)
const reviews = require("./routes/review.js");

const { title } = require("process");

//Require ExpressError for error handling
const ExpressError = require("./utils/ExpressError.js");

//This is root page
app.get("/", (req, res) => {
  res.send("Hey Root");
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);



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
