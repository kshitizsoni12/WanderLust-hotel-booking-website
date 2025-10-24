// first of all we downloaded some modules
// 1.express
// 2ejs
// 3.mongooose                       --------> all by using the syntax -> npm i <modulename>
// 4.ejs-mate
// 5.method-override
// nodemon



const express = require("express");    //requiring express
const app = express();

const port = 8080;   //  defining port

const path = require("path");   // requiring path to run files even from outside 

const methodOverride = require('method-override')    // requiring it to use method=PUT,DELETE,PATCH in form tag while performing CRUD operations 

const Listing = require("./models/listing.js")   //here my schema and model is defined

const ejsmate = require('ejs-mate');


//importing mongoose and setting connection
const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');   // wanderlust here is name of my DB rest al remains constant in URL
}

main().then(() => {
    console.log("connection successfull")
})
    .catch(err => console.log(err));




app.set("view engine", "ejs");         // setting view engine to ejs
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));    // telling that my styling files are in public folder

app.use(express.urlencoded({ extended: true }));   //so that js can read json or bson files coming from DB

app.use(methodOverride('_method'))

app.engine("ejs", ejsmate);

app.listen(port, () => {
    console.log("listening at port 8080")
})

app.get("/abc", (req, res) => {
    abc = def;
    res.send("working home page of wanderlust");
})

app.use((err, req, res, next) => {
    console.log("-------error-------");
    next();
})


// TILL HERE THE CODE ABOVE WILL BW IN EVERY FILE OR EVERY WEBSITE


// CODES SPECIFICALLY FOR THIS WEBBSITE

// index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
})

//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

app.post("/listings", async (req, res) => {
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
})


// show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const idlisting = await Listing.findById(id);
    res.render("listings/show.ejs", { idlisting })
})

// edit route
app.get("/listings/:id/edit", async (req, res) => {
    let { id } = req.params;
    const idlisting = await Listing.findById(id);
    res.render("listings/edit.ejs", { idlisting })
})

app.put("/listings/:id", async (req, res) => {
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
})

// delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})