/*
*   Code By Michael Sherif Naguib
*   Started September 29, 2018
*   Studying @ University of Tulsa
* */
var express = require('express');
var router = express.Router();
var schema = require("../../schemas/scoreTestRequestSchema.js");
var mongoose = require('mongoose');
var questionModelAccess = require("../../models/questionModel.js");
var ObjectID = require('mongodb').ObjectID;
/*
* Title: scoreTest
* Description: accepts a list of json object where each object contains the ID of a question and the proposed answer
*              an attempt is then made to validate and ensure the data matches in form, then the answers are looked up
*              in the database and a list of objects containing the fields ID,correct and a few more where ID is the ID
*              of the question and correct is a boolean value whether the user got the question right. Sends an error
*              back otherwise.
* */
var scoreRequestModel = mongoose.model("scoreTest",schema);
var questionModel = questionModelAccess.getModel();//get the reference to the shared model
mongoose.connect('mongodb://localhost:27017/CertamenDatabase');

router.get("/", function(req, res, next) {
    var scoreRequest = new scoreRequestModel(req.body);
    //validate the document make sure it fits the schema
    scoreRequest.validate((error)=>{
        try{
            //test for initial validation error
            if(error){
                throw error;
            }
            //get the ids from the request
            var question_ids = req.body.map((item)=>{
                return new ObjectID(item._id);
            });
            //query for the response
            questionModel.find({_id: {$in: question_ids}}, (error,docs)=>{
                //log errors: if error or not all the ids could be found...
                if(error ){
                    throw error;
                }else if(docs.length !== req.body.length){
                    throw "The database results quantity does not match the quantity of questions requested; Note do not submit repete questions";
                }
                //iterate over the tests and pickout correct vs incorrect (update database statistics later)
                var correct_ids = [];
                var incorrect_ids=[];
                for(var i=0; i<docs.length;i++){
                    if (docs[i].correctAnswer === req.body[i].userAnswer){
                        correct_ids.push(docs[i]._id);
                    }else{
                        incorrect_ids.push(docs[i]._id);
                    }
                }

                //send the api response
                console.log(`[scoreTestRequest.js] successfully scored a test`);
                res.send(scoreRequest.success(incorrect_ids,correct_ids));
                //Update the info in the database accordingly (this can be done after the response is sent)
                for(item in correct_ids){
                    questionModel.findOneAndUpdate(
                        item._id,
                        {$inc:{"meta.totalTimesAnsweredCorrectly":1,"meta.totalTimesAnswered":1}},
                        (error,res)=>{
                            if(error){
                                throw error;
                            }
                        }
                    );
                }
                //Update the info in the database accordingly (this can be done after the response is sent)
                for(item in incorrect_ids){
                    questionModel.findOneAndUpdate(
                        item._id,
                        {$inc:{"meta.totalTimesAnswered":1}},
                        (error,res)=>{
                            if(error){
                                throw error;
                            }
                        }
                    );
                }
                //pass control
                next();

            });
        }catch(error){
            console.error(`[scoreTestRequest.js] Error: ${error}`);
            res.send(scoreRequest.failure(error));
            next();
        }

    });
});

module.exports = router;