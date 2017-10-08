var mongoose = require('mongoose');
var OptionSchema = new mongoose.Schema({
    //Options will each require a string that contains the name of the option, and a number of votes.
    name: {
        type: String, 
        required: true, 
    }, 
    votes: {
        type: Number,
        required: true
    }
})
var PollSchema = new mongoose.Schema({
    //Each Poll will have an ownerID (Related to User[_id]), the email of the User, and the name of the poll. It will also have options defined
    //In a subschema. 
    ownerID: {
        type: String,
        required: true
    },
    ownerEmail:{
        type:String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    options: [OptionSchema]
});
PollSchema.statics.registerVote = function(id, OptionID){
    //Finds a poll that has an option with matching IDs and increments the value by 1. 
    Poll.findOneAndUpdate(
        {"_id":id, "options._id": OptionID}, 
        {$inc :
            {"options.$.votes":1}},
        function(err, option){
            if(err) {console.log(err)}
            else{
                console.log(option);
            }
        })
}
PollSchema.statics.addOption = function(pollID, name){
    //Given a poll ID this will add an additional votinjg option. 
    Poll.findOneAndUpdate(
        {"_id": pollID},
        {$push:{
            options:{ name: name, votes:0}
        }}
    , function(err, result){
        if (err) console.log(err)
        else{
            console.log(result);
        }
    })
}
PollSchema.statics.listByUserID = function(userID, callback){
    //Given a userID this will return all Polls that belong to a particular user. 
    Poll.find({ownerID: userID },function(err, results){
        if(err) callback(err, null);
        else{
            callback(err, results);
        }
    });
}
var Poll = mongoose.model('Poll', PollSchema);
module.exports = Poll;