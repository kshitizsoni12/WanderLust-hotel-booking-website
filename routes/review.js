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
const asyncwrap = require("../utils/wrapasync.js");
const { validatereview } = require("../middleware.js");  //importing validatereview function from middleware.js to use it here in our routes to validate the review form data from server side using joi schema
const { isLoggedIn } = require("../middleware.js");  //importing isLoggedIn function from middleware.js to use it here in our routes to check if user is logged in or not
const { isReviewAuthor } = require("../middleware.js");  //importing isReviewAuthor function from middleware.js to use it here in our routes to check if user is the author of this review or not

const reviewcontroller = require("../controllers/reviewcontroller.js"); //importing reviewcontroller.js file to use its functions here in our routes




// our all review routes
// post route to add review for a particular listing
router.post("/",isLoggedIn, validatereview, asyncwrap(reviewcontroller.createReview));

// delete route to delete a review 
router.delete("/:reviewid",isLoggedIn ,isReviewAuthor ,asyncwrap(reviewcontroller.deleteReview));


module.exports = router; 