var express = require('express');
var router = express.Router();
var Polls = require('../models/Polls');
/* GET home page. */
router.get('/', function(req, res, next) {
  Polls.find({})
  .then((results) => {
    results.map(addImageIfUndefined);
    res.render('index', {
      polls: results
    });
  }).catch((error) => {

  })
  
});
function addImageIfUndefined(object){
  if(object.pollImage == undefined || object.pollImage == ""){
    object.pollImage = "images\\placeholder1.png"
  }
  return object;
}

module.exports = router;
