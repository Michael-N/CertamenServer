/*
*   Code By Michael Sherif Naguib
*   Started September 29, 2018
*   Studying @ University of Tulsa
* */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/*
* Title: scoreTestRequest.json
* Description: this is the file containing the schema for request objects to have a test scored; in the format
*              a list of objects containing the properties ID corresponding to a mongo database id and the property
*              correct: which is a boolean value
*
* Request Example/Archtype JSON Object in the specified format :
*       [
*           {
*               "_id":"~~~ the mongo database id for the entry would go here ~~~",
*               "answer":"the correct answer string"
*           },
*           {
*               "_id":"~~~ the mongo database id for the entry would go here ~~~",
*               "answer":"the correct answer string"
*           }
*
*           .... and on for every id that list....
*       ]
* */

var scoreTestRequestSchema=new Schema([{
    _id:{type:String, required:true},
    userAnswer:{type:String, required:true}
}]);

//Specifies what to send back for success
scoreTestRequestSchema.methods.success = (incorrectQuestion_ids,correctQuestion_ids)=>{
    //Return the ID of the questions the user got correct or incorrect
    return JSON.stringify({
        status:"scored",
        correct:correctQuestion_ids,
        incorrect:incorrectQuestion_ids,
    });
};
//Specifies what to send back for failure (as in internal server worked properly)
scoreTestRequestSchema.methods.failure = (error)=>{
    return JSON.stringify({status:"failure",error:error});
};
module.exports =scoreTestRequestSchema;

