var express = require('express');
var router = express.Router();
var Poll = require('../models/Polls.js');
router.get('/', function(req,res){
    //TODO: Implement list of all polls. 
    res.send("LIST OF ALL POLLS GOES HERE")
});
router.get('/view/:id', function(req, res){
    //If the user navigates to /view/SomeID it will try to find a poll that has a matching ID, otherwise it will tell the user that it could
    //not find the poll. 
    var pollID = req.params.id;
    Poll.findOne({"_id": pollID}, function(err, result){
        if(err || !result){
            res.send("Could not find Poll!")
        }
        else{
            res.send(result);
        }

    })
})
router.get('/new', function(req,res){
    //If the user navigates to /new and they are not currently authenticated it will inform them that they need to be logged in to create polls. 
    //Otherwise it will give them the form that they can fill out to create a poll. 
    if(req.isAuthenticated){
        res.render('../views/createpoll.ejs');
    }
    else{
        res.send("You must be logged in to create polls");
    }
});
router.post('/new', function(req, res){
    //This will only create a new poll provided the user is logged in, 
    //Otherwise it will tell them that they must be logged in to create polls. 
    if(req.isAuthenticated){
        if(req.body.pollname && req.body.polloptions){
            //If both the name and options field are filled in create a poll.
            var pollName = String(req.body.pollname);
            var options = String(req.body.polloptions).split(",");
            var optArray = [];
            for( let i = 0 ; i < options.length; i++){
                optArray.push({name:options[i].trim(), votes: 0});
            }
            var pollObj = {
				ownerID: req.user["_id"],
				ownerEmail: req.user.email,
				name: pollName, 
				options: optArray
			  }
            Poll.create(pollObj, function(err, poll){
                if(err){
                    res.send("Failed to create poll")
                }
                else{
                    res.send("poll created");
                }
            })
        }
        else{
            //if either the name or options are false, or at least evaluate to false tell the user their input is invalid. 
            res.send("invalid input");
        }
    }
    else{
        //If the user is not logged in inform them that they need to be logged in to create polls.
        res.send("You must be logged in to create polls!");
    }
})

module.exports = router;
