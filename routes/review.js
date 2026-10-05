//1. require express and creating router
//2. replace all app.****() with router.****()
//3. removed /listings/:id/reviews from all routes because we are already using it in app.use("/listings/:id/reviews",reviewRoutes); in index.js
//4. export router at the end of file

// New problem : id of listing is not available in review.js file because we are using it in app.use("/listings/:id/reviews",reviewRoutes); so to make it available in review.js file we will use merge params:true in review.js file
// ie: instead of just "router = express.Router();" we will use "router = express.Router({ mergeParams: true });"
const express = require('express');
const router = express.Router({ mergeParams: true }); 

//5.require all the models and schema and utils which are used in this file(by the routes) 
//6.slightly changing the path -> ex: "./models/listing.js" to "../models/listing.js" because we are now in routes folder and models folder is outside of it

const methodOverride = require('method-override');
router.use(methodOverride('_method'));

const Listing = require('../models/listing.js');
const Review = require('../models/review.js');
const { listingSchema, reviewSchema } = require('../schema.js');
const ExpressError = require("../utils/ExpressError.js")
const asyncwrap = require("../utils/wrapasync.js");

const validatereview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}





// our all review routes
// post route to add review for a particular listing
router.post("/", validatereview, asyncwrap(async(req,res)=>{
    
    let {id} = req.params;
    let idlisting = await Listing.findById(id);

    // creating new review from review schema
    // jo show.ejs me review form banaya tha see there name="review[comment]" and name="review[rating]" asa likha hai it means ki req.body ke andar ek object aayega jiska naam hoga "review" or uske andar do fields hongi comment and rating
    let newreview = new Review(req.body.review);

    // pushing object id of new review into "reviews" array of that particular listing
    idlisting.reviews.push(newreview);

    // saving both review and listing
    await newreview.save();
    await idlisting.save();

    res.redirect(`/listings/${id}`);
}))

// delete route to delete a review 
router.delete("/:reviewid", asyncwrap(async(req,res)=>{
    let {id,reviewid} = req.params;
    // first we will find the listing from which we want to delete the review
    // the $pull operator removes from an existing array all instances of a value or values that match a specified condition.
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewid}});  //reviews array me se wo id delete krdo jo id, reviewid ke barabar ho
    // now we will delete the review from reviews collection also
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
}))


module.exports = router; 