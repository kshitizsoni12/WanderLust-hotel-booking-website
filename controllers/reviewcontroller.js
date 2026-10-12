const Review = require('../models/review.js');
const Listing = require('../models/listing.js');

module.exports.createReview = async(req,res)=>{
    
    let {id} = req.params;
    let idlisting = await Listing.findById(id);

    // creating new review from review schema
    // jo show.ejs me review form banaya tha see there name="review[comment]" and name="review[rating]" asa likha hai it means ki req.body ke andar ek object aayega jiska naam hoga "review" or uske andar do fields hongi comment and rating
    let newreview = new Review(req.body.review);
    newreview.author = req.user._id;  //storing the id of the user who created this review in the "author" field of that particular review

    // pushing object id of new review into "reviews" array of that particular listing
    idlisting.reviews.push(newreview);

    // saving both review and listing
    await newreview.save();
    await idlisting.save();

    res.redirect(`/listings/${id}`);
}


module.exports.deleteReview = async(req,res)=>{
    let {id,reviewid} = req.params;
    // first we will find the listing from which we want to delete the review
    // the $pull operator removes from an existing array all instances of a value or values that match a specified condition.
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewid}});  //reviews array me se wo id delete krdo jo id, reviewid ke barabar ho
    // now we will delete the review from reviews collection also
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/listings/${id}`);
}
