const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js")



require("dotenv").config();
const dburl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connection successfull")
})
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(dburl);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => {
        return { ...obj, owner: "6acb1ddcf90c3624de5bd09c" }; // Replace with actual user ID
    });
    await Listing.insertMany(initdata.data).then((res) => console.log(res)).catch((err) => { console.log(err) });
}

initDB();