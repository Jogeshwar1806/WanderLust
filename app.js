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

//require cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

//require express-session
const session = require("express-session");

//session options for express-sessions
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//middleware for express-session
app.use(session(sessionOptions));

//Require connect-Flash
const flash = require("connect-flash");

//middleware for flash
app.use(flash());


//Requiring passport, passport-local and /models/User.js
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//middleware for using passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware for the flash();
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  console.log(res.locals.currUser);
  next();
});


//Router is required for Routing the websites (for listings)
const listingRouter = require("./routes/listing.js");

//Router is required for Routing the websites (for reviews)
const reviewRouter = require("./routes/review.js");

//Router is required for Routing the websites (for users)
const userRouter = require("./routes/user.js");

const { title } = require("process");

//Require ExpressError for error handling
const ExpressError = require("./utils/ExpressError.js");

//This is root page
app.get("/", (req, res) => {
  console.dir(req.cookies);
  res.send("Hey Root");
});


app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

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
