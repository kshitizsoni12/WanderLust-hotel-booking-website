// here we are creating a schema for our listings collection in our database
const mongoose = require('mongoose');
const review = require('./review');

const listingschema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: {
        type: String,
        //here we are setting a default image if user do not provide any image url
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxkCoVgzcQBR2gm-5O7rZHG91jPS1YMgHcIj1gORYvKg&s=10",
        set: (v) => v === "" ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxkCoVgzcQBR2gm-5O7rZHG91jPS1YMgHcIj1gORYvKg&s=10" : v,
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