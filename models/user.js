// we have to create a schema for data of users who will register on our website

const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

//in user schema, no need to add username and password fields as passport-local-mongoose will automatically add them to our schema and will also add some methods to our schema to hash and salt the password and save it in DB
const userschema = new Schema({
    email : {
        type : String,
        required : true,
    }
})

userschema.plugin(passportLocalMongoose); // this will add username and password fields to our schema.

// now we will create model->"user" for this schema and export it
const user = mongoose.model("user", userschema);
module.exports = user;