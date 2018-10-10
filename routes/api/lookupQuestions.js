/*
*   Code By Michael Sherif Naguib
*   Started September 29, 2018
*   Studying @ University of Tulsa
* */
var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const schema = require("../../schemas/lookupQuestionsRequestSchema.js");
const questionModelAccess = require("../../models/questionModel.js");
const questionModel = questionModelAccess.getModel();
const lookupModel = mongoose.model("lookupModel",schema);
var ObjectID = require('mongodb').ObjectID;


router.get('/', function(req, res, next) {
    var requestedQuestionIdList =new lookupModel(req.body);
    requestedQuestionIdList.validate((error)=>{
        try{
            //throw error if any
            if(error){throw error;}

            //filter to just get the id
            var requestedQuestionObjectIDlist = req.body.map((item)=>{
                return ObjectID(item._id);
            });

            //lookup the documents
            questionModel.find({_id:{$in:requestedQuestionObjectIDlist}},(error,docs)=>{
                //throw error if any
                if(error){throw error;}
                console.log(`[lookupQuestions.js] successfully looked up questions`);
                res.send(requestedQuestionIdList.success(docs));
                next();
            });

        }catch(error){
            //catch error
            console.error(`[lookupQuestions.js] Error: ${error}`);
            res.send(requestedQuestionIdList.failure(error));
            next();
        }
    });
});

module.exports = router;