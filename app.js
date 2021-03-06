// Require express, middleware, etc
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var User = require('./models/Users.js');
var app = express();
//Required for the rest of the page to have access to the routes.
var index = require('./routes/index');
var users = require('./routes/users');
var register = require('./routes/register');
var login = require('./routes/login');
var polls = require('./routes/polls');
var profile = require('./routes/profile');
require('dotenv').config()

//MongoDB setup
var mongoUri = process.env.MONGO_URI;
mongoose.connect(mongoUri, {
  useMongoClient: true
});
var db = mongoose.connection;
//Session and passport setup
var passport = require('passport');
app.use(session({
  secret: 'Randomly selected secret',
  resave: true,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//For flash messages
var flash = require('connect-flash');
app.use(flash());


passport.serializeUser(function(user, done) {
	done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
	  User.findById(id, function(err, user) {
	    done(err, user);
    });
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Required so that the seperate routes actually work. 
app.use('/', index);
app.use('/users', users);
app.use('/register', register);
app.use('/login', login);
app.use('/profile', profile);
app.use('/polls', polls)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.jade');
});
app.listen(8080, function(){
  console.log("Running on port 8080");
})

module.exports = app;
