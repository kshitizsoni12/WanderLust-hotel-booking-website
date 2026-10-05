const express = require('express');
const app = express();

app.listen(3000,()=>{
    console.log("listening at port 3000");
})


//cookie parser -> to read cookies from browser (when its not used, we can set cookies in browser but we cannot read them beacause they are encrypted), so we need to use cookie parser to read cookies from browser
const cookieParser = require('cookie-parser');
// app.use(cookieParser()); //middleware to use cookie parser in our app


//learning cookies
app.get("/setcookie",(req,res)=>{
    res.cookie("name","kshitiz");   //cookie name is "name" and cookie value is "kshitiz" -> this is the data which we want to store as cookie in browser
    res.cookie("age","21");
    res.send("cookies are set");
})

//root page
app.get("/",(req,res)=>{
    console.log(req.cookies);   //this will show all the cookies stored in browser
    res.send("Hii, i am a root page, cookies are set in your browser, check it in inspect->application->cookies");
})

//practical use of cookies
app.get("/greet", (req, res) => {
    let { name, age } = req.cookies;
    res.send(`Hi, ${name}, you are ${age} years old`);
});


// ----------------SIGNED COOKIES--------------------
app.use(cookieParser("mysecretcode"));  //this is the secret key which will be used to sign the cookies. it is used to verify the integrity of the cookies and prevent tampering.

app.get("/setsignedcookie", (req, res) => {
    res.cookie("password", "1234abcd", { signed: true });    
    res.send("Signed cookie is set");
});

app.get("/verify", (req, res) => {
    console.log(req.signedCookies);   //this will show all the signed cookies stored in browser
    res.send("Verified");
});

// if no alteration done in cookie, then it will show the signedcookie value, otherwise it will show undefined or {}.