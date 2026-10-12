const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const asyncwrap = require("../utils/wrapasync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js"); //importing saveRedirectUrl function from middleware.js to use it here in our routes to save the url of the page from which user was redirected to login page
const userController = require("../controllers/usercontroller.js");

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});
router.post("/signup", asyncwrap(userController.signUp)); 


router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
})
router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), userController.logIn);


// logout route - passport provides a logout method to log the user out and destroy the session "req.logout()" and then we will redirect the user to /listings page
router.get("/logout", userController.logOut);


module.exports = router;