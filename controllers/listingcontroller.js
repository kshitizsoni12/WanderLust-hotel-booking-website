const Listing = require('../models/listing');

// index route
//added search functionality by claude AI
module.exports.index = async (req, res) => {
    // coerce to a trimmed, length-limited string
    const q = String(req.query.q || "").trim().slice(0, 50);

    let filter = {};
    if (q) {
        // escape regex special characters so input like "(" or "*" can't break the query
        const safe = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(safe, "i"); // "i" = case-insensitive
        filter = { $or: [{ title: regex }, { location: regex }, { country: regex }] };
    }

    const allListings = await Listing.find(filter);
    res.render("listings/index.ejs", { allListings, q });
}

// new route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

// create route
module.exports.createListing = async (req, res) => {
    //postman or hopscotch se khali form , ya ek do field bas bahrke bhi submit ho sakta hai
    //so to handle form validations from server side
    //thats why we called our function "validatelisting" above see there
    
    const { title, description, price, location, country } = req.body;
    const newListing = new Listing({ title, description, price, location, country });
    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = { url: req.file.path, filename: req.file.filename };
    }
    await newListing.save();

    //adding flash message -> "new listing added successfully"
    req.flash("success", "new listing added successfully");  //key="success"
    res.redirect("/listings")
}

// show route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    //populate("reviews") is a mongoose method which is used here to get all the reviews of that particular listing whose id is given in url , basically it fetches all the details (rating and comment) of reviews whose object ids are stored in "reviews" array of that particular listing 
    // without populate method we will only get array of object ids of reviews not their details such as (comment and rating)
    const idlisting = await Listing.findById(id).populate({path: "reviews", populate: {path: "author"}}).populate("owner");  //populate("owner") is a mongoose method which is used here to get the details of the owner of that particular listing whose id is given in url , basically it fetches all the details (username and email) of owner whose object id is stored in "owner" field of that particular listing
    //if user enters wrong listing id in url then we will show a flash messsage and redirect him to /listings page
    if(!idlisting) {
        req.flash("error", "listing you requested for does not exist");  //key="error"
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { idlisting })
}

// edit route
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const idlisting = await Listing.findById(id);
    //if user enters wrong listing id in url then we will show a flash messsage and redirect him to /listings page
    if(!idlisting) {
        req.flash("error", "listing you requested for does not exist");  //key="error"
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { idlisting })
}

// update route
module.exports.updateListing = async (req, res) => {
    //postman or hopscotch se khali form , ya ek do field bas bahrke bhi submit ho sakta hai
    //so to handle form validations from server side
    //thats why we called our function "validatelisting" above see there

    
    const { id } = req.params;
    const { title, description, price, location, country } = req.body;
    const listing = await Listing.findByIdAndUpdate(id, { title, description, price, location, country }, { new: true });

    // only replace the image if a new file was uploaded
    if (req.file) {
        listing.image = { url: req.file.path, filename: req.file.filename };
        await listing.save();
    }

    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}

// delete route
module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}