/*
*   Code By Michael Sherif Naguib
*   Started September 29, 2018
*   Studying @ University of Tulsa
* */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/*
* Title: insertQuestionRequestJson
* Description: accepts a single question as a json object, validates the object to make sure it meets base requirements for a submission
*              then attempts to insert the question into the database, and respond with an error otherwise
* */

var insertQuestionSchema = new Schema({
    questionText:{type: String, required:[true,"A Question is required"]},
    preQuestionPrompt:{type:String, default:""},
    questionHelp:{type:String, default:"No help is available"},
    tags:{type:[String],required: [true,"At least one tag is required"]},
    fakeAnswers:{type:[String], required: [true,"Fake answers are required"]},
    correctAnswer:{type:String,required:[true,"The correct answer must be specified"]},
    lastUpdated: { type: Date, default: Date.now },
    difficulty:{
        type: Number,
        validate: {
            validator: function(n) {// is it 1-10?
                return 1<=n<=10;
            },
            message: props => `${props.value} not in the range 1-10`
        },
        required:[true,"Must specify a difficulty in the range (easy) 1-10 (most difficult) "]
    },
    latinLevel:{type:String,enum:["I","II","III","IV","POETRY"],required:[true,"Latin Level: I,II,III,IV, or POETRY must be specified"]},
    meta:{
        totalTimesAnswered:{type:Number,default:0},
        totalTimesAnsweredCorrectly:{type:Number,default:0},
        totalSecondsSpentOnQuestion:{type:Number,default:0},
        insertedBy:{type:String,default:"root"},
        isNLEquestion:{type:Boolean,default:false},
        reportedIncorrect:{type:Number,default:0}
    }
});

//Specifies what to send back for success
insertQuestionSchema.methods.success = (_id)=>{
    return JSON.stringify({status:"inserted",_id:_id});
};

//Specifies what to send back for failure
insertQuestionSchema.methods.failure = (error)=>{
    return JSON.stringify({status:"failure",error:error});
};
module.exports =insertQuestionSchema;