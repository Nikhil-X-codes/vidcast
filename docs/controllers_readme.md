# 📦 Controllers in Web Applications

Controllers are functional units in an application that manage business logic. They serve as a bridge between **routes** and **database models**, processing incoming requests, performing operations, and returning appropriate responses.

---

## ✅ Why Are Controllers Used?

1. **Code Reusability**  
   In production-grade systems, reusable and modular code is essential. Controllers promote separation of concerns and reusable logic.

2. **Business Logic Encapsulation**  
   They help developers define and isolate the core functionality of an application in a clear and maintainable way.

---

## ⚙️ How Are Controllers Implemented?

Controllers are typically JavaScript/TypeScript modules or classes. They are:
- **Imported** into the application wherever needed.
- **Exported** and **connected to routes** to handle specific HTTP requests (GET, POST, PUT, DELETE).

---

# 👤 User Controllers Overview

Below are the controllers implemented in our project:

---

## 1. 🔐 Register

- To register a new user, the following fields are **mandatory**:  
  - `email`, `username`, and `password` (minimum 8 characters)  
  - `avatar` and `cover image`

- Upon successful registration, user details are saved in **MongoDB**.

---

## 2. 🔓 Login

- Users log in using their **email** and **password**.

- Upon login, **tokens** are generated for session management:
  - **Access Token:**  
    Stored in the `Authorization` header, expires in a few hours.
  - **Refresh Token:**  
    Stored securely in cookies, lasts longer, and helps generate new access tokens without re-login.

---

## 3. 🚪 Logout

- No input data is needed from the user for logout.

- Middleware is used to authenticate the user using tokens.

- On successful verification, tokens are cleared from cookies, logging out the user.

---

## 4. ♻️ Refresh Access Token

- Refresh token is extracted from cookies and verified.

- New **access** and **refresh tokens** are generated.

- While production typically stores only refresh tokens in cookies, our project stores **both tokens** for ease of access.

---

## 5. 🔁 Change Password

- Validates:
  - Old password
  - Matching new password and confirm password

- Updates the new password and saves it in the database.

---

## 6. 🧾 Get User Details

- Retrieves user details using their unique MongoDB `_id`.

---

## 7. 🆘 Forgot Password

- A utility sends a **password reset link** to the user’s registered email address.

---

## 8. ✏️ Update Images and User Info

- In production, different controllers usually manage file uploads for better structure.

- In our implementation, users can update only:
  - `username`
  - `email`

---

🧩 **Note:** In real-world applications, these controller functionalities are usually broken down into separate service layers for improved scalability and maintainability.

