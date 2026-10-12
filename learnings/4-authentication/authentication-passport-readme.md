#Press Ctrl+k then V
# Authentication, Password Hashing & Passport.js

## Part 1: Authentication vs Authorization

### 🔐 Authentication

**Authentication = verifying who someone is.**

Example:

```text
You enter:
Username → kshitiz
Password → ****

        ↓

Server verifies

        ↓

"Yes, this is Kshitiz"
```

Examples:
- Login
- Signup
- Fingerprint
- Google login

👉 **Authentication = WHO are you?**

---

### 🛡️ Authorization

**Authorization = checking what you are allowed to do.**

Example:

```text
Student → Can view result
Student → ❌ Cannot update result

Teacher/Admin → Can update result
```

👉 **Authorization = WHAT are you allowed to do?**

### Easy difference

> **Authentication → Who are you?**  
> **Authorization → What can you access/do?**

---

## Part 2: How Passwords Are Stored

We **never store the original password** in the database.

❌ Bad:

```text
username: kshitiz
password: Mypassword
```

Instead, we store a **hashed version**:

```text
"Mypassword"
      ↓
 Hashing function
      ↓
"bivrn994i0nidh03fhhh904f4ni904"
```

So database contains:

```text
username: kshitiz
password: hashed_value
```

### How does login work?

Suppose you enter:

```text
Mypassword
```

During login:

```text
Mypassword
     ↓
Same hashing process
     ↓
bivrn994i0nidh03fhhh904f4ni904
     ↓
Compare with database hash
     ↓
Match ✅ → Login successful
```

We don't need to convert the stored hash back to the original password.

---

## Part 3: Properties of Hashing Functions

### 1. Fixed-length output

Different input sizes can produce an output of a **fixed length**.

```text
"hello"       → ABC123...
"mypassword"  → XYZ789...
```

### 2. One-way function

```text
Password
   ↓
Hash
```

is easy.

But:

```text
Hash
  ↓
Original password
```

should **not be possible**.

### 3. Different input → different output

```text
"hello" → ABC123...
"Hello" → XYZ789...
```

Even a small difference normally produces a different hash.

### 4. Small change → huge change

For example:

```text
"password"
     ↓
Hash A

"Password"
     ↓
Completely different Hash B
```

This property is called the **avalanche effect**.

---

## Part 4: Salting

**Salting = adding a random string to the password before hashing.**

Suppose:

```text
Password = "password"
Salt     = "%@?"
```

Instead of:

```text
password → hash
```

we do:

```text
password + "%@?"
       ↓
"password%@?"
       ↓
     hash
       ↓
hashed password
```

### Why?

Suppose two users have the same password:

```text
User A → password
User B → password
```

Without salt:

```text
User A → same hash
User B → same hash
```

With different salts:

```text
User A:
password + saltA → hashA

User B:
password + saltB → hashB
```

So even if their passwords are the same, their stored hashes can be different.

👉 **Salt makes password storage stronger against attacks such as precomputed/rainbow-table attacks.**

---

## Part 5: Passport.js

**Passport.js is used mainly for authentication.**

It provides different authentication strategies.

For example, users can authenticate using:

```text
Username + Password
        OR
Google
        OR
Microsoft
        OR
LinkedIn
        OR
other providers
```

### For username/password authentication

Install:

```bash
npm i passport
npm i passport-local
npm i passport-local-mongoose
```

### What each one does?

**`passport`**

→ Main authentication framework.

**`passport-local`**

→ Allows authentication using a local username/password.

**`passport-local-mongoose`**

→ Makes it easier to use Passport with a Mongoose User model, including password hashing/authentication functionality.

---

## Part 6: Configuring Passport Strategy

### 1. `passport.initialize()`

```js
app.use(passport.initialize());
```

This **initializes Passport** in our Express application.

```text
Express App
    ↓
Passport initialized
    ↓
Passport can handle authentication
```

### 2. `passport.session()`

```js
app.use(passport.session());
```

This allows Passport to use **sessions**.

Why?

After login, we don't want the user to authenticate again on every page.

```text
Login
  ↓
Authentication successful
  ↓
Session created
  ↓
User moves between pages
  ↓
Passport remembers the user
```

This requires Express sessions to be configured.

### 3. Local Strategy

```js
passport.use(new LocalStrategy(User.authenticate()));
```

This tells Passport:

> **"When someone logs in using username/password, use `User.authenticate()` to verify them."**

Flow:

```text
User enters
username + password
        ↓
Passport LocalStrategy
        ↓
User.authenticate()
        ↓
Check stored credentials
        ↓
Valid? ──────→ ✅ Login
   │
   └──────────→ ❌ Reject
```

---

## Serialize and Deserialize User

These are used when **Passport + Session** are working together.

### `serializeUser()`

After successful login:

```text
User
 ↓
serializeUser()
 ↓
Store user's identifier in session
```

Think:

> **Serialize = User → Session**

### `deserializeUser()`

On a later request:

```text
Session
   ↓
deserializeUser()
   ↓
Find user from database
   ↓
req.user
```

Think:

> **Deserialize = Session → User**

### Complete flow

```text
LOGIN
  ↓
Username + Password
  ↓
LocalStrategy
  ↓
User.authenticate()
  ↓
✅ Authentication successful
  ↓
serializeUser()
  ↓
User ID stored in session
  ↓
Next request
  ↓
deserializeUser()
  ↓
Find user from DB
  ↓
req.user
```

---

## 🔑 Quick Revision

- **Authentication** = Who are you?
- **Authorization** = What can you do?
- **Hashing** = Don't store the original password.
- **Salting** = Add random data before hashing.
- **Passport** = Handles authentication.
- **Serialize** = User → Session.
- **Deserialize** = Session → User.
