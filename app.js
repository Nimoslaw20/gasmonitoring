require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { database } = require('./config/env');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();
var debug = require('debug')('LPGDetection:app.js');
mongoose.Promise = require('bluebird');
var deviceRouter = require('./app/routes/devices');
var stationRouter = require('./app/routes/stations/stations');
var authorityUserRouter = require('./app/routes/authority-branch/authority-branch-user');
var authorityBranchRouter = require('./app/routes/authority-branch/authority-branch');
var stationUserRouter = require('./app/routes/stations/station-user');
var authorityUserLoginRouter = require('./app/routes/authority/authority-user');

//connection of server to the database
mongoose.connect(database.url, {
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', [
  deviceRouter,
  stationRouter,
  stationUserRouter,
  authorityBranchRouter,
  authorityUserRouter,
  authorityUserLoginRouter,
]);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

//Headers
app.use((req, res, next) => {
  res.header(
    'Access-Control-llow-Headers',
    'Content-Type, Accept, Authorization'
  );
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  // res.render('error');
});

module.exports = app;

// MONGOOSE DEFAULTS
mongoose.connection.on('connected', function() {
  debug('Mongoose default connection connected');
});
mongoose.connection.on('error', function(err) {
  debug('Mongoose default connection error:' + err);
});
mongoose.connection.on('disconnected', function() {
  debug('Mongoose default connection disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected on app termination');
    debug('Mongoose default connection disconnected on app termination');
    process.exit(0);
  });
});
