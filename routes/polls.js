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
            req.flash('flash', "Could Not find Poll");
            res.redirect('/');
        }
        else{
            if(req.isAuthenticated()){
                //If the user is logged in show a version of the page that has a field to add an option
                res.render('../views/viewpoll_auth.ejs', {poll: result});
            }
            else{
            res.render('../views/viewpoll.ejs', {poll: result});
            }
        }

    })
})
router.get('/vote/:pollID/:optionID', function(req, res){
    var pollID = String(req.params.pollID);
    var optionID = String(req.params.optionID);
    Poll.registerVote(pollID, optionID);
    res.redirect('/polls/view/' + pollID);
})
router.get('/new', function(req,res){
    //If the user navigates to /new and they are not currently authenticated it will inform them that they need to be logged in to create polls. 
    //Otherwise it will give them the form that they can fill out to create a poll. 
    if(req.isAuthenticated()){
        res.render('../views/createpoll.ejs');
    }
    else{
        req.flash('flash', "You must be logged in to create polls");
        res.redirect('/login')
    }
});
router.get('/delete/:id', function(req,res){
    //If the user is both logged in and the owner of the poll this will allow them to delte it.
    var pollID = req.params.id;
    if(req.isAuthenticated()){
        Poll.findById(pollID
        , function(err, result){
            if(err || !result){
                req.flash('flash', "Could Not delete poll");
                res.redirect('/profile')
            }
            else if(result.ownerID === String(req.user._id)){
                Poll.findByIdAndRemove(pollID,{}, function(err, result){
                    if(err){
                        req.flash('flash', "Could Not delete poll");
                        res.redirect('/profile')
                    }
                    else{
                        req.flash('flash', "Poll Removed");
                        res.redirect('/profile')
                    }
                })
            }
            else{
                res.send("could not delete poll");
            }
        }
    )
    }
    else{
        req.flash('flash', "You must be logged in to perform this action");
        res.redirect('/')
    }
})
router.post('/addOption/:id', function(req, res){
    if(req.isAuthenticated()){
        let pollID = req.params.id;
        let optionName = req.body.optionName;
        Poll.addOption(pollID, optionName);
        res.redirect('/polls/view/' + pollID);
    }
    else{
        req.flash('flash', "You must be logged in to perform this action");
        let pollID = req.params.id;
        res.redirect('/polls/view/' + pollID);
    }
})
router.post('/new', function(req, res){
    //This will only create a new poll provided the user is logged in, 
    //Otherwise it will tell them that they must be logged in to create polls. 
    if(req.isAuthenticated()){
        if(req.body.pollname && req.body.polloptions){
            //If both the name and options field are filled in create a poll.
            var pollName = String(req.body.pollname);
            var pollImage = req.body.pollimage;
            var options = String(req.body.polloptions).split(",");
            var optArray = [];
            for( let i = 0 ; i < options.length; i++){
                optArray.push({name:options[i].trim(), votes: 0});
            }
            var pollObj = {
				ownerID: req.user["_id"],
				ownerEmail: req.user.email,
				name: pollName, 
                options: optArray,
                pollImage: pollImage,
			  }
            Poll.create(pollObj, function(err, poll){
                if(err){
                    res.send("Failed to create poll")
                    req.flash('flash', "Failed to create poll");
                    res.redirect('/')
                }
                else{
                    req.flash('flash', "Poll Created");
                    res.redirect('/profile/')
                }
            })
        }
        else{
            //if either the name or options are false, or at least evaluate to false tell the user their input is invalid. 
            req.flash('flash', "Invalid form input");
            res.redirect('/polls/new');
        }
    }
    else{
        //If the user is not logged in inform them that they need to be logged in to create polls.
        req.flash('flash', "You must be logged in to create polls");
        res.redirect(401, '/login');
    }
})

module.exports = router;
