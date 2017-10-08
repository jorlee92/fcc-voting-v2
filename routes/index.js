var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.isAuthenticated()){
    // res.send("You are logged in!");
    
    res.send(req.user);
  }
  else{
  res.render('index', { title: 'Express' });
  }
});


module.exports = router;
