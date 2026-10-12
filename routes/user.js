const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncwrap = require("../utils/wrapasync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js"); //importing saveRedirectUrl function from middleware.js to use it here in our routes to save the url of the page from which user was redirected to login page

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", asyncwrap(async (req, res, next) => {
    try{
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password); // this will hash and salt the password and save it in DB

        //we want just after signup, user should be logged in automatically, so we will use passport.authenticate() method to log the user in automatically after signup
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!"); // flash message to show after successful signup
            res.redirect("/listings");
        })
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}));

router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
})

router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), (req,res) =>{
    //req.user returns email, username, _id, and other info of the user who is logged in
    console.log(req.user);
    req.flash("success", "Welcome to Wanderlust");
    res.redirect(res.locals.redirectUrl || "/listings"); //if user was redirected to login page from some other page then after login he will be redirected back to that page, otherwise he will be redirected to same page from which he was redirected to login page
})

// logout route - passport provides a logout method to log the user out and destroy the session "req.logout()" and then we will redirect the user to /listings page
router.get("/logout", (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You have been logged out");
        res.redirect("/listings");
    });
});

module.exports = router;