var express = require('express');
var router = express.Router();
var User = require('../models/Users.js');
var passport = require('passport');

var passport = require('passport')
, LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy({    
    usernameField: 'email',
    passwordField: 'password'
    },
    function(email, password, done) {
    User.authenticate(email, password, function(err, user){
        if(err){
            console.log("Auth error!");
            return done(err)
        }
        else if (!user){
            console.log("Incorrect login");
            return done(null, false);
        }
        else{
            console.log("Auth success");
            return done(null, user);
        }
    } )
    }
    ));
router.post('/', passport.authenticate('local'),
    function(req, res) {
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      console.log("User would see that the login worked")
      res.send("Logged in!");
    });

router.get('/', function(req, res){
    if(req.isAuthenticated()){
        res.send("You are logged in!");
      }
      else{
    res.render('../views/login.ejs');
    }
})



// router.post('/', function(req,res, next){
//     if(req.body.email && req.body.password){
//         User.authenticate(req.body.email, req.body.password, function(err, user){
//             if(err || !user){
//                 res.send("Login Failed!");
//             }
//             else{
//                 res.send("Hello, " + user.email);
//                 // req.sessionID = user[_id];
//                 console.log(req.sessionID);
//             }
//         })
//     }
//     else{
//         res.send("Please enter a username and password")
//     }
// })

module.exports = router;