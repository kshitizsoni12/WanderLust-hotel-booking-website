//------------------------PART 2------------------------------
const express = require("express");
const app = express();
const path = require("path");

app.listen(3000, () => {
    console.log("server is running on port 3000");
});


//1.npm install express-session
const session = require("express-session");

// configuring session
const sessionOptions = {
    secret: "thisisasecret", // secret key to sign the session
    resave: false, // forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized: true, // forces a session that is "uninitialized" to be saved to the store
};
app.use(session(sessionOptions));

//open http://localhost:3000/test in browser->inspect->application->cookies->localhost->connect.sid(if something like this is there then session is working)
//All tabs on same browser have same session id, even if we refresh the page.
app.get("/test", (req, res) => {
    res.send("test successful");
});


// -------------------------PART 3------------------------------
//practical example 
app.get("/viewcount", (req, res) => {
    if (req.session.viewcount) {
        req.session.viewcount++;    
    } else {
        req.session.viewcount = 1;
    }
    res.send(`You have viewed this page ${req.session.viewcount} times`);
});


// -------------------------PART 4-----------------------------
// we need to give url with a query like this: http://localhost:3000/register?username=kshitiz
app.get("/register", (req, res) => {
    const { username } = req.query;
    console.log(req.session);      //return a session object with a unique session ID and other properties
    req.session.username = username;       // we can add any property to the session object and it will be stored in the session store
    console.log(req.session);
    res.send("username added to session, go to /welcome to see the username");
});

//even if we close the browser and open it again, the session will still be there because the session ID is stored in a cookie in the browser and the session data is stored in the server memory. 
app.get("/welcome", (req, res) => {
    if (req.session.username) {
        res.send(`Welcome ${req.session.username}`);        
    } 
});



// -------------------------PART 5-----------------------------
// using connect-flahsh to show flash messages
const flash = require("connect-flash");
app.use(flash());

//example
app.get("/register2", (req, res) => {
    const { username } = req.query;
    req.session.username = username;       
    req.flash("success", "new user registered successfully");      // we can add any property(key value pair) to the session object and it will be stored in the session store
    res.redirect("/welcome2");
});

//we need view engine to show flash messages
app.set("view engine", "ejs");         
app.set("views", path.join(__dirname, "views"));


//even if we close the browser and open it again, the session will still be there because the session ID is stored in a cookie in the browser and the session data is stored in the server memory. 
// app.get("/welcome2", (req, res) => {

//     res.render("flash.ejs", { username: req.session.username, msg:req.flash("success")});        // we can access the flash message in the view using msg variable
// });


// -------------------------PART 6-----------------------------
//also a better way to show flash messages is to use middleware to set the flash message in res.locals so that we can access it in all views without having to set it in every route.
app.use((req, res, next) => {
    res.locals.msg = req.flash("success");  
    next();
});

app.get("/welcome2", (req, res) => {       
    res.render("flash.ejs", { username: req.session.username});       
});