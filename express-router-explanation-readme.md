The main idea of `Express Router` is:

> **Instead of keeping all routes in `app.js`, divide routes according to models/features into separate files.**

### 1. Before Router

Your `app.js` becomes messy:

```js
app.get("/listings", ...)
app.post("/listings", ...)
app.get("/listings/:id", ...)
app.put("/listings/:id", ...)
app.delete("/listings/:id", ...)
app.post("/listings/:id/reviews", ...)
app.delete("/listings/:id/reviews/:reviewId", ...)

// more models...
```

So we create: a folder named routes

routes/
   listings.js
   reviews.js
```
---

## 2. `routes/listings.js`

Instead of `app.get()` we use **`router.get()`**.

First create a router:

const express = require("express");
const router = express.Router();

Then:

router.get("/", ...)
router.post("/", ...)
router.get("/:id", ...)
router.put("/:id", ...)
router.delete("/:id", ...)

Notice something important:

### Before

app.get("/listings/:id", ...)

### Inside `listings.js`

router.get("/:id", ...)

We remove `/listings`.

Why?
Because we'll tell Express in `app.js`:

app.use("/listings", listings);

So Express combines them:
/listings + /:id
       ↓
/listings/:id

## 3. Export the router

At the bottom of `routes/listings.js`:
module.exports = router;

Meaning:

> "I'm giving this router to whoever requires this file."


## 4. Now `app.js`

Require the router:

const listings = require("./routes/listings");
// similarly
const reviews = require("./routes/reviews");


Then:
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

Now Express knows:

/listings
    ↓
use routes/listings.js

and:

/listings/:id/reviews
    ↓
use routes/reviews.js


## 5. How the final path is formed

Suppose `routes/listings.js` has:
router.get("/:id", ...)

and `app.js` has:
app.use("/listings", listings);

Express combines them:

/listings + /:id
       ↓
/listings/:id



So, 
Your `app.js` mainly becomes responsible for:

```js
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
```

while the actual route logic stays inside the respective files.
---