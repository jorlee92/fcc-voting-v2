var express = require('express');
var router = express.Router();
var Poll = require('../models/Polls.js');
router.get('/', function(req, res){
    //If the user is logged in show them their profile, otherwise redirect them to the index. 
    if(req.isAuthenticated){
        Poll.listByUserID(req.user["_id"],
            function(err, results){
                if(err || !results) {
                    res.render('profile.ejs', {});
                }
                else{
                    console.log(results);
                    res.render('profile.ejs', {
                        UserName: req.user.email,
                        polls: results
                    })
                }
            }

        )
    }
    else{
        res.redirect('/');
    }
})

module.exports = router;