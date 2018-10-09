/*
*   Code By Michael Sherif Naguib
*   Started September 29, 2018
*   Studying @ University of Tulsa
* */
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
const schema = require("../../schemas/insertQuestionRequestSchema.js");

/*
* Title: insertQuestion
* Description: accepts a single question as a json object, validates the object to make sure it meets base requirements for a submission
*              then attempts to insert the question into the database, and respond with an error otherwise
* */
var questionModel = mongoose.model("insertQuestion",schema);
mongoose.connect('mongodb://localhost:27017/CertamenDatabase');
router.get('/', function(req, res,next) {
        var question = new questionModel(req.body);
        question.save((error,questionItem)=>{
            if(error){
                console.error(`[insertQuestion.js] Error: ${error}`);
                res.send(question.failure(error));
                next();
            }else{
                console.log(`[insertQuestion.js] question with _id: ${questionItem._id} inserted`);
                res.send(question.success(questionItem._id));
                next();
            }
        });
});

module.exports = router;