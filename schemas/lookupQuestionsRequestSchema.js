/*
*   Code By Michael Sherif Naguib
*   Started September 29, 2018
*   Studying @ University of Tulsa
* */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//the schema for looking up a question...
var lookupQuestionsRequestSchema=new Schema([{_id:{type:String, required:true}}]);

//Specifies what to send back for success
lookupQuestionsRequestSchema.methods.success = (list_of_questions)=>{
    //Return the ID of the questions the user got correct or incorrect
    return JSON.stringify({
        status:"success",
        questions:list_of_questions
    });
};
//Specifies what to send back for failure (as in internal server worked properly)
lookupQuestionsRequestSchema.methods.failure = (error)=>{
    return JSON.stringify({status:"failure",error:error});
};
module.exports =lookupQuestionsRequestSchema;
