const Listing = require("./models/listing");
const Review = require('./models/review.js');
const {listingSchema} = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js")
const {reviewSchema } = require('./schema.js');


//validating the form data from server side using joi schema
module.exports.validatelisting = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}

//validating the review form data from server side using joi schema
module.exports.validatereview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}



//if user is not logged in and he tries to create a new listing then we will show a flash messsage and redirect him to login page -> and this check is done by passport.js method "req.isAuthenticated()" which returns true if user is logged in and false if not
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        //req.originalUrl -> returns the url of the page from which user was redirected to login page, so after login we will redirect him back to that page
        //rdirectUrl is a custom property(key) we are adding to req.session object to store the url of the page from which user was redirected to login page
        req.session.redirectUrl = req.originalUrl;

        req.flash("error", "you must be logged in first");  //key="error"
        return res.redirect("/login");
    }
    next();
}


module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    const idlisting = await Listing.findById(id);
    if(!idlisting.owner.equals(res.locals.currentUser._id)) {  //checking if the user who is trying to edit this listing is the owner of this listing or not
        req.flash("error", "you are not the owner of this listing");  //key="error"
        return res.redirect(`/listings/${id}`);
    }
    next();
}




module.exports.isReviewAuthor = async (req, res, next) => {
    let {id,reviewid} = req.params;
    const review = await Review.findById(reviewid);
    if(!review.author.equals(res.locals.currentUser._id)) {  //checking if the user who is trying to edit this listing is the owner of this listing or not
        req.flash("error", "you are not the author of this review");  //key="error"
        return res.redirect(`/listings/${id}`);
    }
    next();
}