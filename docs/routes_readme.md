# 🌐 Routes in Node.js (Express.js)


## 📌 What are Routes?

**Routes** are collections of **endpoints** that define specific paths (URLs) on a server.  
They tell your backend **where** and **how** to respond when a user makes a request.

> Think of routes as the "address + instructions" for your server to act on user requests.

---

## ❓ Why Are Routes Used?

1. ✅ **Handle Specific Requests**  
   Routes respond to particular user actions like:
   - `/login`
   - `/forgot-password`
   - `/dashboard`

2. ✅ **Build RESTful APIs**  
   Routes help structure your backend by:
   - Mapping HTTP methods to actions (GET, POST, PUT, etc.)
   - Organizing logic for CRUD operations (Create, Read, Update, Delete)

---

## ⚙️ How Are Routes Implemented?

Routes are created using **HTTP methods** like:

- `GET` – Retrieve data
- `POST` – Submit data
- `PUT` – Update full data
- `PATCH` – Update partial data
- `DELETE` – Remove data


### 🧾 Sample Code

```js
const express = require('express');
const app = express();

app.get('/home', (req, res) => {
  res.send('Welcome to the Home Page');
});

app.post('/login', (req, res) => {
  res.send('Login Request Received');
});

app.put('/user/:id', (req, res) => {
  res.send(`User with ID ${req.params.id} updated`);
});

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
