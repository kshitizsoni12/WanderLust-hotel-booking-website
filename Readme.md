# 🧭 Wanderlust

A full-stack hotel / stay listing and booking-style web application inspired by Airbnb. Users can browse stays from around the world, search them, create and manage their own listings with image uploads, and leave star-rated reviews.

Built with **Node.js, Express, MongoDB Atlas and EJS** using the **MVC** pattern.

---

## ✨ Features

- **Listings (full CRUD):** create, view, edit and delete listings
- **Image upload:** listing photos are uploaded to **Cloudinary** through Multer (5 MB limit, png/jpg/jpeg only)
- **Search:** search by title, city or country (case-insensitive, regex-safe, max 50 characters)
- **Reviews and ratings:** 1-5 star ratings with comments, shown with the author's name
- **Authentication:** signup, login and logout with **Passport.js** (local strategy); passwords are hashed and salted by `passport-local-mongoose`
- **Auto-login after signup**, and **redirect back** to the page the user originally wanted after login
- **Authorization:**
  - only logged-in users can create listings or reviews
  - only the **owner** can edit or delete a listing
  - only the **author** can delete a review
- **Persistent sessions:** stored in MongoDB Atlas using `connect-mongo`
- **Flash messages** for success and error feedback
- **Validation on both sides:** Bootstrap client-side validation and **Joi** server-side validation
- **Centralized error handling** with a custom `ExpressError` class, an async wrapper and a custom error page
- **Cascade delete:** deleting a listing also deletes all of its reviews
- **Responsive UI** with Bootstrap 5, Font Awesome icons and custom CSS

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 22 |
| Framework | Express 5 |
| Database | MongoDB Atlas with Mongoose 8 |
| Templating | EJS with `ejs-mate` (layouts and partials) |
| Authentication | Passport, `passport-local`, `passport-local-mongoose` |
| Sessions | `express-session` with `connect-mongo` |
| Flash messages | `connect-flash` |
| Validation | Joi |
| File upload | Multer with `multer-storage-cloudinary` and Cloudinary |
| Forms | `method-override` (PUT and DELETE from HTML forms) |
| Frontend | Bootstrap 5.3, Font Awesome 6, custom CSS |

---

## 📁 Project Structure

```
wanderlust-hotel-booking-website/
├── controllers/            # Route logic (the "C" in MVC)
│   ├── listingcontroller.js
│   ├── reviewcontroller.js
│   └── usercontroller.js
├── models/                 # Mongoose schemas (the "M" in MVC)
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── routes/                 # Express routers
│   ├── listing.js
│   ├── review.js
│   └── user.js
├── views/                  # EJS templates (the "V" in MVC)
│   ├── includes/           # navbar, footer, flash
│   ├── layouts/            # boilerplate.ejs
│   ├── listings/           # index, show, new, edit
│   ├── users/              # login, signup
│   └── error.ejs
├── public/
│   ├── css/style.css
│   └── js/app.js           # Bootstrap form validation script
├── utils/
│   ├── ExpressError.js     # Custom error class
│   └── wrapasync.js        # Async error wrapper
├── init/
│   ├── data.js             # Sample listings
│   └── init.js             # Database seeding script
├── learnings/              # Personal study notes (routers, cookies, sessions, auth)
├── middleware.js           # isLoggedIn, isOwner, isReviewAuthor, validators
├── schema.js               # Joi schemas
├── cloudConfig.js          # Cloudinary and Multer storage config
├── index.js                # App entry point
└── package.json
```

> `routes/beforeMVC*.js` are older versions of the routes from before the controllers were separated. They are kept for reference and are not used by the app.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v22 or later
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (free tier is fine)
- A [Cloudinary](https://cloudinary.com/) account (free tier is fine)

### 1. Clone and install

```bash
git clone <your-repository-url>
cd wanderlust-hotel-booking-website
npm install
```

### 2. Create a `.env` file

Create a `.env` file in the project root:

```env
ATLASDB_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/wanderlust
SECRET=<long-random-string-see-below>

CLOUD_NAME=<your-cloudinary-cloud-name>
CLOUD_API_KEY=<your-cloudinary-api-key>
CLOUD_API_SECRET=<your-cloudinary-api-secret>
```

| Variable | Purpose |
|---|---|
| `ATLASDB_URL` | MongoDB Atlas connection string (also used by the session store) |
| `SECRET` | Signs the session cookie and encrypts session data in the database |
| `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` | Cloudinary credentials for image uploads |

**Generating a valid `SECRET`:** `connect-mongo` encrypts session data with `kruptein`, which requires a strong secret (32+ characters with uppercase, lowercase, numbers and symbols). Generate one with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Use it without quotes, and make sure it contains no `#` (dotenv treats `#` as a comment).

### 3. Allow network access in Atlas

In MongoDB Atlas, go to **Network Access** and add your IP address (or `0.0.0.0/0` for testing only).

### 4. (Optional) Seed sample data

1. Run the app, sign up and create a user.
2. Copy that user's `_id` from Atlas (the `users` collection).
3. Open `init/init.js` and replace the `owner` value with that id.
4. Run:

```bash
node init/init.js
```

> ⚠️ This **deletes all existing listings** before inserting the sample data.

### 5. Run the app

```bash
# development (auto-restart)
nodemon index.js

# or plain node
node index.js
```

Open **http://localhost:8080/listings**

---

## 🔗 Routes

### Listings

| Method | Path | Description | Access |
|---|---|---|---|
| GET | `/listings` | All listings (supports `?q=search`) | Public |
| GET | `/listings/new` | New listing form | Logged in |
| POST | `/listings` | Create a listing | Logged in |
| GET | `/listings/:id` | Show a listing with its reviews | Public |
| GET | `/listings/:id/edit` | Edit form | Owner |
| PUT | `/listings/:id` | Update a listing | Owner |
| DELETE | `/listings/:id` | Delete a listing and its reviews | Owner |

### Reviews

| Method | Path | Description | Access |
|---|---|---|---|
| POST | `/listings/:id/reviews` | Add a review | Logged in |
| DELETE | `/listings/:id/reviews/:reviewid` | Delete a review | Review author |

### Users

| Method | Path | Description |
|---|---|---|
| GET / POST | `/signup` | Register a new user |
| GET / POST | `/login` | Log in |
| GET | `/logout` | Log out |

---

## 🗄️ Data Models

**Listing:** `title`, `description`, `image { url, filename }`, `price`, `location`, `country`, `reviews [ObjectId → review]`, `owner (ObjectId → user)`

**Review:** `comment`, `rating (1-5)`, `createdate`, `author (ObjectId → user)`

**User:** `email`, plus `username`, `hash` and `salt` added by `passport-local-mongoose`

---

## 🔐 Security Notes

- Passwords are never stored in plain text (hashed and salted)
- Session cookies are `httpOnly` and expire after 7 days
- Secrets are loaded from environment variables; `.env` is gitignored
- Search input is length-limited and regex-escaped
- All form input is validated on the server with Joi
- Uploads are restricted by file type and size

**For production deployment**, also consider setting `cookie.secure: true` (requires HTTPS and `app.set("trust proxy", 1)` behind a proxy) and adding `helmet` and rate limiting.

---

## 🗺️ Possible Improvements

- Privacy and Terms pages (the footer links exist but the routes do not yet)
- Booking and date availability
- Map integration for locations
- Category filters and pagination
- Delete the old image from Cloudinary when a listing is updated or deleted
- Read the port from `process.env.PORT` for hosting platforms

---

## 📚 Learning Notes

The `learnings/` folder contains notes and demo code written while building this project:

1. Express Router
2. Cookies and signed cookies
3. Sessions and flash messages
4. Authentication, hashing, salting and Passport.js

---

## 👤 Author

**Kshitiz Soni**

- [YouTube](https://www.youtube.com/@kshitizsoni5040)
- [Instagram](https://www.instagram.com/_kshitizsoni/)
- [LinkedIn](https://www.linkedin.com/in/kshitiz-soni-828b69324/)

---

Made with ❤️ while learning full-stack web development.