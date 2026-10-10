const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncwrap = require("../utils/wrapasync.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", asyncwrap(async (req, res) => {
    try{
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password); // this will hash and salt the password and save it in DB
    req.flash("success", "Welcome to Wanderlust!"); // flash message to show after successful signup
    res.redirect("/listings");
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login", passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), async(req,res) =>{
    req.flash("success", "Welcome to Wanderlust");
    res.redirect("/listings");
})


module.exports = router;