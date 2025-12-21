// we have to create a schema for data of reviews given by people on different hotels

const mongoose = require('mongoose');
const { Schema } = mongoose;
// we dont need to setup connection here again, as we are just writing schema here , not using any insert/update/delete functionality of mongoose

const reviewschema = new Schema({
    comment : {
        type : String
    },
    rating : {
        type : Number,
        min : 1,
        max : 5,
        default : 3
    },
    createdat : {
        type : Date,
        default : Date.now()
    }
})

// now we will create model->"review" for this schema and export it
const review = mongoose.model("review", reviewschema);
module.exports = review;

// Now we want that each listing can have multiple reviews , so we will import this review schema in listing schema and will use it as an array of subdocuments in listing schema
// ---------we will store object Ids of reviews in listing schema---------