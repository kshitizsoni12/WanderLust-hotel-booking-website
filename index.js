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
// 10.express-session
// 11.npm i connect-flash


// requiring dotenv to use .env file
require('dotenv').config();

//requiring express
const express = require("express");    
const app = express();
const port = 8080;
 
// requiring path to join to paths of files
const path = require("path");  

//normally in form tag we can only use method=GET or POST but for CRUD operations we need to use PUT,DELETE,PATCH also.
//so requiring it to use method=PUT,DELETE,PATCH in form tag while performing CRUD operations 
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

// similar as includes -> used to create boilerplate or layouts for our each page
// ex: har page me navbar and footer and bootstrap/g fonts ka link wgr to same hi rhega to wo sare chize ek boilerplate.ejs me likha aur baki jgh usko import kr lunga simply
const ejsmate = require('ejs-mate');
app.engine("ejs", ejsmate);



//importing mongoose and setting connection with databse
const mongoose = require('mongoose');
// url of cloud database from .env file
const dburl = process.env.ATLASDB_URL;

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");   // wanderlust here is name of my DB rest all remains same in URL
}
main().then(() => {
    console.log("connected to database successfully")
})
    .catch(err => console.log(err));




// setting view engine to ejs -> setup for using EJS
app.set("view engine", "ejs");         
app.set("views", path.join(__dirname, "views"));

// telling that my CSS n JS files are in public folder-> and i can use them from anywhere
app.use(express.static(path.join(__dirname, "public")));    

//Code so that js can read json or url encoded files coming from DB
app.use(express.urlencoded({ extended: true }));   
app.use(express.json());

// requiring express-session
const session = require("express-session");
// setting up session options and using it in app
const sessionOptions = {
    secret: "thisshouldbeabettersecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7, // cookie will expire in 7 days
        maxAge : 1000 * 60 * 60 * 24 * 7, // cookie will expire in 7 days
        httpOnly : true, // cookie cannot be accessed by client side js
    }
};
app.use(session(sessionOptions));

// requiring connect-flash to show flash messages (Implementing -> whenever a new listing is added, a flash message will be shown)
const flash = require("connect-flash");
app.use(flash());
//middleware to set flash messages in res.locals so that we can access them in all ejs files
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.listen(port, () => {
    console.log("listening at port 8080");
})


// Now inserting initial sample data into our database in seprate folder init go see there then come back


// TILL HERE THE CODE ABOVE WILL BE SAME IN EVERY FILE OR EVERY WEBSITE





// NOW CODES SPECIFICALLY FOR THIS WEBSITE

// home route
app.get("/", (req, res) => {
    res.render("listings/home.ejs");
})

// --------------------------------------------------------------------------------------------------
//listing routes are in seprate file named listings.js inside routes folder , so importing it here
const listingRoutes = require("./routes/listing.js");
// now using it here
app.use("/listings",listingRoutes);


//review routes are in seprate file named review.js inside routes folder , so importing it here
const reviewRoutes = require("./routes/review.js");
// now using it here
app.use("/listings/:id/reviews",reviewRoutes);
// ---------------------------------------------------------------------------------------------------





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