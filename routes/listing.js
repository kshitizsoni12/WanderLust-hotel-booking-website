//1. require express and creating router
//2. replace all app.****() with router.****()
//3. remove /listings from all routes because we are already using it in app.use("/listings",listingRoutes); in index.js
//4. export router at the end of file

const express = require("express");
const router = express.Router();

//5.require all the models and schema and utils which are used in this file(by the routes) 
//6.slightly changing the path -> ex: "./models/listing.js" to "../models/listing.js" because we are now in routes folder and models folder is outside of it

const methodOverride = require('method-override');
router.use(methodOverride('_method'));

const Listing = require("../models/listing.js"); 
const asyncwrap = require("../utils/wrapasync.js");
const { validatelisting } = require("../middleware.js");  //importing validatelisting function from middleware.js to use it here in our routes to validate the form data from server side using joi schema
const { isLoggedIn } = require("../middleware.js");  //importing isLoggedIn function from middleware.js to use it here in our routes to check if user is logged in or not
const { isOwner } = require("../middleware.js");  //importing isOwner function from middleware.js to use it here in our routes to check if currently logged in user is the owner of the listing or not

const listingcontroller = require("../controllers/listing.js");  //importing listingcontroller from controllers/listing.js to use it here in our routes to handle the logic of the routes




// Our all listing routes
// index route
router.get("/", asyncwrap(listingcontroller.index));

//new route
router.get("/new", isLoggedIn, listingcontroller.renderNewForm);

//create route
router.post("/",isLoggedIn ,validatelisting, asyncwrap(listingcontroller.createListing));  

// show route
router.get("/:id", asyncwrap(listingcontroller.showListing));

// edit route
router.get("/:id/edit",isLoggedIn, isOwner, asyncwrap(listingcontroller.renderEditForm));

//update route
router.put("/:id",isLoggedIn, isOwner, validatelisting , asyncwrap(listingcontroller.updateListing));

// delete route
router.delete("/:id", isLoggedIn, isOwner, asyncwrap(listingcontroller.deleteListing));

module.exports = router;















// ***TO understand the below code(concepts of error and async handling) see this project codes before routing***




// //  Now as we are using databse we may get async errors ,like - price me number ke jgh string daal diya form me ___OR___ galat _id daal diya url me 
// // so to handle such async errors we are making our wrapasync.js and custom error class inside UTILS folder
// // importing custom error class

// const ExpressError = require("./utils/ExpressError.js")

// // importing here asyncwrap function

// const asyncwrap = require("./utils/wrapasync.js");
// const { error } = require("console");


// // NOW jitne bhi async code hai sabko wrap krdo or send krdo as a input inside asyncwrap() function


// //postman or hopscotch se khali form , ya ek do field bas bahrke bhi submit ho sakta hai
// //so to handle form validations from server side

// const validatelisting = (req,res,next) => {
//     let {error} = listingSchema.validate(req.body);
//     if(error){
//         let errMsg = error.details.map(el => el.message).join(",");
//         throw new ExpressError(400, errMsg);
//     }else{
//         next();
//     }
// }
