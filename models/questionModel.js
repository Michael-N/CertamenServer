/*
*   Code By Michael Sherif Naguib
*   Started September 29, 2018
*   Studying @ University of Tulsa
* */
const schema = require("../schemas/insertQuestionRequestSchema.js");
var mongoose = require('mongoose');

//Establish a connection to the database...
mongoose.connect('mongodb://localhost:27017/CertamenDatabase');
//create the model
var modelInstance = mongoose.model("insertQuestion",schema);

//make the reference available
module.exports = {getModel:function(){
        return modelInstance;
    }
}