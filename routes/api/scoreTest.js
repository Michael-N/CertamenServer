/*
*   Code By Michael Sherif Naguib
*   Started September 29, 2018
*   Studying @ University of Tulsa
* */
var express = require('express');
var router = express.Router();
var schema = require("../../schemas/scoreTestRequestSchema.js");
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;
/*
* Title: scoreTest
* Description: accepts a list of json object where each object contains the ID of a question and the proposed answer
*              an attempt is then made to validate and ensure the data matches in form, then the answers are looked up
*              in the database and a list of objects containing the fields ID,correct and a few more where ID is the ID
*              of the question and correct is a boolean value whether the user got the question right. Sends an error
*              back otherwise.
* */
var scoreRequestModel = mongoose.model("scoreTest",schema);
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
                console.log(ObjectId(item._id));
                return ObjectId(item._id);
            });
            //query for the response
            scoreRequestModel.find({_id: {$in: question_ids}}).exec((error,docs)=>{
                console.log(docs);
                if(error){
                    throw error;
                }

                //iterate over the tests and pickout correct vs incorrect (update database statistics later)
                correct_ids = [];
                incorrect_ids=[];
                for(let i=0; i<docs.length;i++){
                    if (docs[i].correctAnswer === req.body[i].answer){
                        correct_ids.push(docs[i]._id);
                    }else{
                        incorrect_ids.push(docs[i]._id);
                    }
                }

                console.log(`[scoreTestRequest.js] successfully scored a test`);
                res.send(scoreRequest.success(incorrect_ids,correct_ids));

                //Update the info in the database accordingly (this can be done after the response is sent)
                for(item in correct_ids){
                    scoreRequestModel.updateOne({_id:ObjectId(item._id)},{$inc:{}})
                }

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