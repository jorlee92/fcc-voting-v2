var express = require('express');
var router = express.Router();
var Poll = require('../models/Polls.js');
router.get('/', function(req, res){
    //If the user is logged in show them their profile, otherwise redirect them to the login page. 
    if(req.isAuthenticated()){
        Poll.listByUserID(req.user["_id"],
            function(err, results){
                if(err || !results) {
                    res.render('profile.ejs', {});
                }
                else{
                    res.render('profile.ejs', {
                        UserName: req.user.email,
                        polls: results,
                        flash: req.flash('flash')
                    })
                }
            }

        )
    }
    else{
        req.flash('flash', "You must be logged in to view your profile");
        res.redirect('/login');
    }
})

module.exports = router;