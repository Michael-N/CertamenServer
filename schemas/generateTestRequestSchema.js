/*
*   Code By Michael Sherif Naguib
*   Started September 29, 2018
*   Studying @ University of Tulsa
* */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//generates a test based on the criteria
var generateTestRequestSchema=new Schema({
    tags:{type:[String],default:[]},
    quantity:{
        type:Number,
        default:1,
        validate: {
            validator: function(n) {// do not allow over 40 at a time nor negative or 0
                return 0<n<=40;
            },
            message: props => `${props.value} not in range [1,40] the max number of questions allowed to be queried is 40!`
        },},
    difficultyRange:{type:[numbers],
        validate: {
            validator: function(n) {// is it 1-10?
                n.sort();
                return !(n[0]>=0 && 10>=n[1])// i.e   the range n is not inside [1,10]
            },
            message: props => `${props.value} not in the range [1,10]`
        },
        default:[1,10]},
    latinLevel:{
        type:String,
        enum:["I","II","III","IV","POETRY"]
    },
    onlyNLEquestions:{type:Boolean,default:false},
});

//Specifies what to send back for success
generateTestRequestSchema.methods.success = (questions)=>{
    //Return the ID of the questions the user got correct or incorrect
    return JSON.stringify({
        status:"scored",
        questions:questions
    });
};
//Specifies what to send back for failure (as in internal server worked properly)
generateTestRequestSchema.methods.failure = (error)=>{
    return JSON.stringify({status:"failure",error:error});
};
module.exports =generateTestRequestSchema;