// here we are creating a schema for our listings collection in our database
const mongoose = require('mongoose');
const review = require('./review');

const listingschema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
        type: String,
        //here we are setting a default image if user do not provide any image url
        default: "https://images.unsplash.com/vector-1745695275676-ae261124fea9?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        set: (v) => v === "" ? "https://images.unsplash.com/vector-1745695275676-ae261124fea9?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v,
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    // now adding reviews array to listing schema to store object Ids of each reviews for that listing
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'review',
        }
    ]
})

// now we will setup a middleware to delete all reviews associated with a listing when that listing is deleted
listingschema.post('findOneAndDelete', async function(listing) {
    if (listing) {
        // delete all reviews whose ids are in listing.reviews array 
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
})


const Listing = mongoose.model("Listing", listingschema);
module.exports = Listing;