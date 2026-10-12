const User = require("../models/user.js");

module.exports.signUp = async (req, res, next) => {
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
}

module.exports.logIn = (req,res) =>{
    //req.user returns email, username, _id, and other info of the user who is logged in
    console.log(req.user);
    req.flash("success", "Welcome to Wanderlust");
    res.redirect(res.locals.redirectUrl || "/listings"); //if user was redirected to login page from some other page then after login he will be redirected back to that page, otherwise he will be redirected to same page from which he was redirected to login page
}

module.exports.logOut = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You have been logged out");
        res.redirect("/listings");
    });
}