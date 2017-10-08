var express = require('express');
var router = express.Router();
var User = require('../models/Users.js');

router.get('/', function(req,res){
    //loads the registration form when somebody naviates to /register
    res.render('../views/register.ejs');
})
router.post('/', function(req, res, next){
    if( req.body.email && req.body.password && req.body.comfirmPassword){
        //if the email, password, and password confirmation are all filled in continue
        if(!(String(req.body.password) === String(req.body.comfirmPassword))){
            //Check the password against its confirmation, if they do not match inform the user.
            res.send("Passwords do not match")
        }
        else{
        //if everything is filled in and the passwords match try create a new user given the username and password. 
        var userData = { "email": req.body.email, "password": req.body.password };
        User.create(userData, function(err, user){
            if(err){
                res.send("Failed to register!");
            }
            else{
                res.send("Registration Successful!");
            }
                });
            }
        }
    else{
        //if the input was invalid (Likely not completely filled in) tell the user. 
        res.send("invalid input");
    }
  })

module.exports = router;
  