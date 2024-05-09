const mongoose=require('mongoose');


const playerSchema=new mongoose.Schema({
    playerName : {
        type : String,
        required : true
    },
    role : String,
    points : {
        type : Number,
        default : 0
    }
});
const teamSchema=mongoose.Schema({
    teamName : {
        type : String,
        required:[true,'Please provide team name']
    },
    teamPoints : {
        type : Number,
        default : 0
    },
    players : {
        type : [playerSchema],
        required : [true,"Provide a list of players"],
        default : []
    },
    captain : {
        type : String,
        required : true
    },
    viceCaptain : {
        type : String,
        required : true
    }

},{timestamps : true});



const teamResultSchema=mongoose.Schema({
    teamName : {
        type : String,
        required:[true,'Please provide team name']
    },
    winningStatus : {
        type : String,
        default : "participated"
    },
    teamPoints : {
        type : Number,
        default : 0
    },
    players : {
        type : [playerSchema],
        required : [true,"Provide a list of players"],
        default : []
    },
    captain : {
        type : String,
        required : true
    },
    viceCaptain : {
        type : String,
        required : true
    }

},{timestamps : true});
exports.teamResultModel=mongoose.model("TeamResults",teamResultSchema);

exports.modelObject=mongoose.model("Team",teamSchema);          // collectionName, Schema