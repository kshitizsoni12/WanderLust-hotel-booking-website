# Part 1 — What is State?

**State = information about what happened before and needs to be remembered for future requests.**

For example, on Amazon:

```text
You → Login
You → Open Electronics
You → Add Laptop to Cart
You → Open Beauty section
```

HTTP by itself doesn't remember that **the laptop was added to your cart**. Each HTTP request is treated independently.

This is why we need mechanisms like **sessions** to maintain state.

---

## Stateful vs Stateless

### 🟢 Stateful

A **stateful protocol** keeps information about the previous communication/session.

Example from the screenshot:
**FTP** is stateful.

The server remembers things such as:
```text
Who is connected?
What is their current session?
Where are they in the file transfer?
```

### 🟡 Stateless

A **stateless protocol** does not remember previous requests by itself.

Example:

**HTTP is stateless.**

```text
Request 1 → Server
Request 2 → Server
Request 3 → Server
```

The server doesn't automatically know that Request 2 came from the same user as Request 1.

---

### 💰 Simple money-transfer analogy

Think of two ways of transferring money.

**Cash:**

```text
A → gives ₹500 cash → B
```

Once the transaction is finished, there isn't an ongoing system that needs to remember A and B's previous interaction.

**UPI:**

```text
A → UPI request → Bank Server
                  ↓
             Transaction
                  ↓
             Transaction status
```

The banking system needs to maintain information about the transaction while it is being processed.

> This is just an analogy for understanding **state**. UPI itself should not simply be classified as a "stateful protocol" based on this example.

---

# Part 2 — Express Sessions

## What does Express Session do?

`express-session` helps us make our normally **stateless HTTP application behave statefully**.

Suppose Amazon has two users:

```text
USER 1
Session ID = 101
Items:
   → Laptop
   → Charger


USER 2
Session ID = 102
Items:
   → Shirt
   → Pants
```

The server stores this session information separately.

```text
                    SERVER
              ┌─────────────────┐
Session 101 → │ Laptop          │
              │ Charger         │
              └─────────────────┘

Session 102 → ┌─────────────────┐
              │ Shirt           │
              │ Pants           │
              └─────────────────┘
```

The browser stores the **Session ID (SID)** in a cookie.

```text
Browser
   │
   │ Cookie: connect.sid = 101
   ↓
Server
   │
   ↓
Find session 101
   │
   ↓
Laptop + Charger
```

So when the user moves from:

```text
/electronics
        ↓
/beauty
```

HTTP itself doesn't remember the previous request.

But the browser sends the same **SID**, allowing Express Session to find that user's session data.

### Simple diagram

```text
                  BROWSER
                     │
              Cookie: SID=101
                     │
                     ↓
              EXPRESS SERVER
                     │
              Find Session 101
                     │
                     ↓
        ┌────────────────────────┐
        │ Session 101            │
        │ cart: Laptop, Charger  │
        │ username: Kshitiz      │
        └────────────────────────┘
```

---

# Express Session Code

### 1. Install

```bash
npm i express-session
```

### 2. Require

```js
const session = require("express-session");
```

### 3. Configure session

```js
app.use(session({
    secret: "thisisasecret"
}));
```

The `secret` is used to **sign the session ID cookie** so the server can detect tampering.

---

### 4. Now create a route

```js
app.get("/test", (req, res) => {
    res.send("test successful");
});
```

When you visit:

```text
http://localhost:3000/test
```

Express Session creates a **session for you** and sends a session ID cookie, commonly named something like:

```text
connect.sid
```

You can see it in:

```text
Inspect
   ↓
Application
   ↓
Cookies
   ↓
localhost:3000
```

---

# Part 3 — Exploring Session Options

## Why is SID same in multiple Chrome tabs?

Suppose you open:

```text
Chrome Tab 1 → localhost:3000/test
Chrome Tab 2 → localhost:3000/test
Chrome Tab 3 → localhost:3000/test
```

All tabs normally belong to the **same browser session/profile**.

Therefore they share the same cookies:

```text
Chrome
 ├── Tab 1 ──┐
 ├── Tab 2 ──┼── SID = 101
 └── Tab 3 ──┘
```

Similarly:

```text
IE Tab 1 ──┐
IE Tab 2 ──┼── SID = 202
IE Tab 3 ──┘
```

Chrome and IE have different cookie storage.

Therefore:

```text
Chrome SID = 101
IE SID     = 202
```

Even though both visit:

```text
localhost:3000/test
```

### Practical meaning

This allows the server to distinguish:

```text
Chrome user → Session 101
IE user     → Session 202
```

---

# `viewcount` Example

```js
app.get("/viewcount", (req, res) => {
    if (req.session.viewcount) {
        req.session.viewcount++;
    } else {
        req.session.viewcount = 1;
    }

    res.send(`You have viewed this page ${req.session.viewcount} times`);
});
```

### First visit

No `viewcount` exists:

```text
undefined
   ↓
viewcount = 1
```

Response:

```text
You have viewed this page 1 times
```

### Second visit

Session remembers:

```text
viewcount = 1
```

Then:

```text
1 → 2
```

Response:

```text
You have viewed this page 2 times
```

### Third visit

```text
2 → 3
```

So:

```text
Browser
   ↓ SID=101
Server
   ↓
Session 101
   ↓
viewcount = 3
```

That's the practical use of a session: **storing information specific to a particular user/session across multiple requests.**

---

# ⚠️ Session Storage Warning

The screenshot says:

> `MemoryStore` is not designed for a production environment.

By default, Express Session uses **MemoryStore**.

It stores session data in the server's memory.

Problems:

- ❌ Not suitable for production
- ❌ Can leak memory
- ❌ Doesn't scale properly across multiple server processes/instances
- ✅ Fine for learning and development

In production, we normally use a proper session store such as **MongoDB, Redis, etc.**

---

# Part 4 — Storing and Using Sessions

## Register

We have:

```js
app.get("/register", (req, res) => {
    const { username } = req.query;

    console.log(req.session);

    req.session.username = username;

    console.log(req.session);

    res.send("username added to session, go to /welcome to see the username");
});
```

Visit:

```text
http://localhost:3000/register?username=kshitiz
```

### Step 1

```js
const { username } = req.query;
```

Gets:

```text
username = kshitiz
```

### Step 2

```js
req.session.username = username;
```

Now the session contains:

```js
{
    username: "kshitiz"
}
```

The session is associated with the user's SID.

---

## Welcome

```js
app.get("/welcome", (req, res) => {
    if (req.session.username) {
        res.send(`Welcome ${req.session.username}`);
    }
});
```

When the user visits:

```text
/welcome
```

the browser sends the SID:

```text
SID
 ↓
Server
 ↓
Find corresponding session
 ↓
username = kshitiz
 ↓
Welcome kshitiz
```

### Important correction

With the default session configuration, the session ID cookie is generally a **session cookie**, so you should **not assume the session will survive closing the browser**. Its behavior depends on the cookie configuration/browser.

The important concept is:

```text
Cookie → stores SID
Server-side session store → stores session data
```

---

# Part 5 — `connect-flash`

## What is `connect-flash`?

`connect-flash` is used to show **temporary messages** to the user.

Examples:

```text
"Login successful!"
"Invalid password!"
"New user registered successfully!"
"Listing deleted successfully!"
```

The flash message is stored in the **session** and is generally meant to be read once and then removed.

---

## Step 1 — Install

```bash
npm i connect-flash
```

## Step 2 — Require

```js
const flash = require("connect-flash");
```

## Step 3 — Middleware

```js
app.use(flash());
```

This is used **after session middleware is configured**, because flash messages use the session.

---

# Using Flash Message

```js
app.get("/register2", (req, res) => {
    const { username } = req.query;

    req.session.username = username;

    req.flash(
        "success",
        "new user registered successfully"
    );

    res.redirect("/welcome2");
});
```

Suppose we visit:

```text
/register2?username=kshitiz
```

### What happens?

```text
username = kshitiz
       ↓
Store username in session
       ↓
Store flash message in session
       ↓
Redirect to /welcome2
```

---

## `/welcome2`

```js
app.get("/welcome2", (req, res) => {
    res.render("flash.ejs", {
        username: req.session.username,
        msg: req.flash("success")
    });
});
```

Here:

```js
req.flash("success")
```

gets the flash message.

So:

```js
msg
```

contains:

```text
new user registered successfully
```

---

# EJS File

```ejs
<body>
    <p><%= msg %></p>

    <h1>Welcome, <%= username %>!</h1>
</body>
```

The browser finally sees:

```text
new user registered successfully

Welcome, kshitiz!
```

### Complete flow

```text
/register2?username=kshitiz
            ↓
     Store username
            ↓
     Store flash message
            ↓
       redirect()
            ↓
        /welcome2
            ↓
     req.flash("success")
            ↓
          msg
            ↓
         EJS page
```

---

# Part 6 — Using `res.locals`

Previously we did:

```js
app.get("/welcome2", (req, res) => {
    res.render("flash.ejs", {
        username: req.session.username,
        msg: req.flash("success")
    });
});
```

Now:

```js
app.get("/welcome2", (req, res) => {
    res.locals.msg = req.flash("success");

    res.render("flash.ejs", {
        username: req.session.username
    });
});
```

### What changed?

Before:

```text
Route
 ↓
Pass msg manually
 ↓
EJS
```

Now:

```text
Route
 ↓
res.locals.msg
 ↓
EJS
```

`res.locals` contains variables that are automatically available to the view rendered by that response.

So in EJS you can still use:

```ejs
<p><%= msg %></p>
```

without passing `msg` inside `res.render()`.

---

# Even Better — Use Middleware

Instead of writing this in every route:

```js
res.locals.msg = req.flash("success");
```

we can create middleware:

```js
app.use((req, res, next) => {
    res.locals.msg = req.flash("success");
    next();
});
```

Now this runs for every request.

Then:

```js
app.get("/welcome2", (req, res) => {
    res.render("flash.ejs", {
        username: req.session.username
    });
});
```

No need to write:

```js
res.locals.msg = ...
```

inside every route.

### Flow

```text
Request
   ↓
Flash Middleware
   ↓
req.flash("success")
   ↓
res.locals.msg
   ↓
next()
   ↓
Route
   ↓
res.render()
   ↓
EJS can directly use `msg`
```

### Why is this better?

Because flash messages are usually needed across **many different routes**.

Instead of repeating:

```js
res.locals.msg = req.flash("success");
```

everywhere, we write it **once as middleware**.

---

## 🔑 Final Picture

```text
                EXPRESS SESSION
                      │
             ┌────────┴────────┐
             ↓                 ↓
        Session ID          Session Data
          (cookie)        (server-side)
             │                 │
             │                 ├── username
             │                 ├── viewcount
             │                 └── flash messages
             │
             ↓
          Browser
```

And the overall idea is:

**Remember:**

> **Cookie → identifies the session**  
> **Session → stores user-specific data**  
> **Flash → temporary message stored in session**  
> **res.locals → makes data easily available to EJS**
