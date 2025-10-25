// first of all we downloaded some modules
// 1.express
// 2ejs
// 3.mongooose                       --------> all by using the syntax -> npm i <modulename>
// 4.ejs-mate
// 5.method-override
// 6.nodemon(installing it globally)
// 7.joi
// 8.dotenv
// 9.connect-mongo


// requiring dotenv to use .env file
require('dotenv').config();

//requiring express
const express = require("express");    
const app = express();
const port = 8080;
 
// requiring path to join to paths of files
const path = require("path");  

// requiring it to use method=PUT,DELETE,PATCH in form tag while performing CRUD operations 
const methodOverride = require('method-override') 
app.use(methodOverride('_method'))
   
// same as includes -> used to create boilerplate or templates for our each page
// ex: har page me navbar and footer and bootstrap/g fonts ka link wgr to same hi rhega to wo sare chize ek boilerplate.ejs me likha aur baki jgh usko import kr lunga simply
const ejsmate = require('ejs-mate');
app.engine("ejs", ejsmate);

//importing mongoose and setting connection with databse
const mongoose = require('mongoose');

// url of cloud database from .env file
const dburl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect(dburl);   // wanderlust here is name of my DB rest all remains same in URL
}
main().then(() => {
    console.log("connected to database successfully")
})
    .catch(err => console.log(err));


// writing schema in folder named -> 'models' ,see there in listing.js
// now importing schema here
const Listing = require("./models/listing.js") 


// setting view engine to ejs -> setup for using EJS
app.set("view engine", "ejs");         
app.set("views", path.join(__dirname, "views"));

// telling that my CSS n JS files are in public folder-> and i can use them from anywhere
app.use(express.static(path.join(__dirname, "public")));    

//Code so that js can read json or bson files coming from DB
app.use(express.urlencoded({ extended: true }));   
app.use(express.json());

// importing schema for server side form validation
const {listingSchema} = require("./schema.js");

app.listen(port, () => {
    console.log("listening at port 8080")
})


// Now inserting initial sample data into our database in seprate folder init go see there then come back


// TILL HERE THE CODE ABOVE WILL BW IN EVERY FILE OR EVERY WEBSITE





// NOW CODES SPECIFICALLY FOR THIS WEBSITE

// home route
app.get("/", (req, res) => {
    res.render("listings/home.ejs");
})



//  Now as we are using databse we may get async errors ,like - price me number ke jgh string daal diya form me ___OR___ galat _id daal diya url me 
// so to handle such async errors we are making our wrapasync.js and custom error class inside UTILS folder
// importing custom error class
const ExpressError = require("./utils/ExpressError.js")
// importing here asyncwrap function
const asyncwrap = require("./utils/wrapasync.js");
const { error } = require("console");


// NOW jitne bhi async code hai sabko wrap krdo or send krdo as a input inside asyncwrap() function


//postman or hopscotch se khali form , ya ek do field bas bahrke bhi submit ho sakta hai
//so to handle form validations from server side
const validatelisting = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}


// index route
app.get("/listings", asyncwrap(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}))

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

app.post("/listings",validatelisting, asyncwrap(async (req, res) => {
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
    res.redirect("/listings")
}))


// show route
app.get("/listings/:id", asyncwrap(async (req, res) => {
    let { id } = req.params;
    const idlisting = await Listing.findById(id);
    res.render("listings/show.ejs", { idlisting })
}))

// edit route
app.get("/listings/:id/edit", asyncwrap(async (req, res) => {
    //postman or hopscotch se khali form , ya ek do field bas bahrke bhi submit ho sakta hai
    //so to handle form validations from server side
    //thats why we called our function "validatelisting" above see there
   
    let { id } = req.params;
    const idlisting = await Listing.findById(id);
    res.render("listings/edit.ejs", { idlisting })
}))

app.put("/listings/:id",validatelisting , asyncwrap(async (req, res) => {
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
app.delete("/listings/:id", asyncwrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))





// IF user enters any other route than above routes, then to show "page not found" error
app.use((req,res,next)=>{
    next(new ExpressError(404,"PAGE NOT FOUND"));
});

// ERROR HANDLING MIDDLEWARE
// It's code is same for both async & non-async error
app.use((err,req,res,next) =>{
    let {status = 500 , message = "Something went wrong"} = err;
    // instead of sending status and message we will render "error.ejs"
    res.render("error.ejs",{message});
})