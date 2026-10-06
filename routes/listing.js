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
const {listingSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js")
const asyncwrap = require("../utils/wrapasync.js");

const validatelisting = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}




// Our all listing routes
// index route
router.get("/", asyncwrap(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}))

//new route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
})

//create route
router.post("/",validatelisting, asyncwrap(async (req, res) => {
    //postman or hopscotch se khali form , ya ek do field bas bahrke bhi submit ho sakta hai
    //so to handle form validations from server side
    //thats why we called our function "validatelisting" above see there
    


    let { title, description, image, price, location, country } = req.body;
    let newlisting = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country,
    })
    await newlisting.save();

    //adding flash message -> "new listing added successfully"
    req.flash("success", "new listing added successfully");  //key="success"
    res.redirect("/listings")
}))


// show route
router.get("/:id", asyncwrap(async (req, res) => {
    let { id } = req.params;
    //populate("reviews") is a mongoose method which is used here to get all the reviews of that particular listing whose id is given in url , basically it fetches all the details (rating and comment) of reviews whose object ids are stored in "reviews" array of that particular listing 
    // without populate method we will only get array of object ids of reviews not their details such as (comment and rating)
    const idlisting = await Listing.findById(id).populate("reviews");
    //if user enters wrong listing id in url then we will show a flash messsage and redirect him to /listings page
    if(!idlisting) {
        req.flash("error", "listing you requested for does not exist");  //key="error"
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { idlisting })
}))

// edit route
router.get("/:id/edit", asyncwrap(async (req, res) => {
    let { id } = req.params;
    const idlisting = await Listing.findById(id);
    //if user enters wrong listing id in url then we will show a flash messsage and redirect him to /listings page
    if(!idlisting) {
        req.flash("error", "listing you requested for does not exist");  //key="error"
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { idlisting })
}))

router.put("/:id",validatelisting , asyncwrap(async (req, res) => {
    //postman or hopscotch se khali form , ya ek do field bas bahrke bhi submit ho sakta hai
    //so to handle form validations from server side
    //thats why we called our function "validatelisting" above see there

    
    let { id } = req.params;
    let { title, description, image, price, location, country } = req.body;
    await Listing.findByIdAndUpdate(id, {
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country,
    });
    res.redirect(`/listings/${id}`);
}))

// delete route
router.delete("/:id", asyncwrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))


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
