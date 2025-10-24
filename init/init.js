const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js") 

main().then(() => {
    console.log("connection successfull")
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data).then((res) => console.log(res)).catch((err) => { console.log(err) });
}

initDB();