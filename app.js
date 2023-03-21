var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var logger = require("morgan");
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const mongoose = require("mongoose");
const nationRouter = require("./routes/nationRouter");
const playerRouter = require("./routes/playerRouter");
const userRouter = require("./routes/userRouter");
require('./config/passport')(passport);
const url = "mongodb://127.0.0.1:27017/assignment3";
const connect = mongoose.connect(url);
// mongoose.set('strictQuery',true);
connect
  .then((db) => {
    console.log("Connected correctly to server");
  })
  .catch((err) => {
    console.log(err);
  });

var indexRouter = require("./routes/index");

var app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
 res.locals.error = req.flash('error');
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + '/uploads'));
app.use("/nations", nationRouter);
app.use("/players", playerRouter);
app.use("/users", userRouter);
app.use("/", indexRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
