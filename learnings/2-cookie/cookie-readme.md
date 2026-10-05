<!-- STUDY COOKIES CODE FROM LEARNING COOKIES FOLDER -->

# Web Cookies 🍪

# Part 1: What are Web Cookies? 🍪
A **cookie** is a small piece of data stored by the user's **web browser**.

Cookies are generally stored as: name : value
### Example -> username : Kshitiz
The browser saves this cookie.

### Uses of Cookies

- **Session management** → remember logged-in users
- **Personalization** → remember user preferences
- **Tracking** → remember user activity

For now, we'll focus on **personalization**.

---
# Part 2: How do we send a Cookie in Express?

Suppose we have:
```js
app.get("/setcookies", (req, res) => {
    res.cookie("username", "Kshitiz");
    res.send("Cookie sent!");
});
```

### What happens?

When user visits: /setcookies
Express executes:
```js
res.cookie("username", "Kshitiz");
```

This tells the **browser**:
Save this cookie: username : Kshitiz
The browser stores it.

### Then what?
For future requests to that website, the browser automatically sends the cookie back:
```text
Browser
   ↓
Cookie: username=Kshitiz
   ↓
Server
```

So another route can receive that cookie.

> **Important:** The cookie is automatically sent for requests that match the cookie's domain/path and other cookie rules. So, practically, it can be available across the site's routes when configured normally.

---

# Part 3: What does "Parsing Cookies" mean?

Suppose we sent:
```js
res.cookie("username", "Kshitiz");
```

Now we want to read it:
```js
app.get("/greet", (req, res) => {
    console.dir(req.cookies);
});
```

But: "req.cookies"
may be: undefined

### Why?

The browser sends cookies in the request as a **Cookie header**, and Express doesn't automatically convert that header into the convenient `req.cookies` object.

We need **cookie-parser**.

---

## Using `cookie-parser`

### 1. Install

```bash
npm i cookie-parser
```

### 2. Require it

```js
const cookieParser = require("cookie-parser");
```

### 3. Use it as middleware

```js
app.use(cookieParser());
```

Now `cookie-parser` reads/parses the incoming Cookie header and puts the cookies into: req.cookies

---
Then we can do: small practical use
```js
app.get("/greet", (req, res) => {
    let { username } = req.cookies;

    res.send(`Hi, ${username}`);
});
```

**In one line:**  
`res.cookie()` → **send/set cookie** 🍪 → Browser stores it → Browser sends it back → `cookie-parser` → `req.cookies` **reads it**.


<!-- -----------SIGNED COOKIE------------->
# Signed Cookies 🍪

## 1. Normal Cookie vs Signed Cookie

### Normal Cookie
A normal cookie is simply:- name : value

Example:
```js
res.cookie("color", "red");
```

Browser stores: color = red

The problem is that the user can potentially **modify the cookie value** in the browser.

---
### Signed Cookie

A **signed cookie** adds a signature using a **secret code**.
```js
app.use(cookieParser("secretcode"));
```

Then:
```js
res.cookie("color", "red", { signed: true });
```

The important purpose is:
> **A signed cookie helps verify that the cookie value has not been modified/tampered with.**

### ⚠️ Important

A signed cookie is **not encrypted**.
So its purpose is **not to hide sensitive data like passwords**.
The secret is used to create/verify a **signature**, not to encrypt the cookie value.

---

# 2. Sending a Signed Cookie

It is generally a **3-step process**.

### Step 1: Give `cookie-parser` a secret
```js
app.use(cookieParser("secretcode"));
```

### Step 2: Send the cookie with `signed: true`
```js
app.get("/getsignedcookie", (req, res) => {
    res.cookie("color", "red", { signed: true });

    res.send("done!");
});
```

# 3. Verifying the Signed Cookie
To read signed cookies:
```js
app.get("/verify", (req, res) => {
    res.send(req.signedCookies);
});
```

`cookie-parser` checks the signature using the secret.

### If cookie was NOT modified:

```js
req.signedCookies
```
will contain:

```js
{ color: "red" }
```

### If someone modified the cookie:
The signature no longer matches.
So the cookie will **not be accepted as a valid signed cookie** and it won't appear as a valid value in `req.signedCookies` (for example, you may get `{}` for that cookie).

---
### Remember this 🔑

**Normal cookie → stores data**
**Signed cookie → stores data + verifies it wasn't altered**
**Signed ≠ encrypted**.