# 🛠️ Node.js Backend Utilities

This project contains reusable utility functions that support core backend functionality like error handling, file uploading, email services, and standardized responses. These utilities keep your codebase clean, consistent, and easy to maintain.

---

## 📌 What Are Utilities?

Utilities are **helper functions** that are indirectly used in business logic or controllers.  
They are not tied to specific features but are essential for:

---

## ⚙️ Why Use Utilities?

1. 🔁 **Clean & Reusable** – Avoid repetition by centralizing common logic.
2. 🤝 **Team-Friendly** – Easier for developers to understand and maintain consistent code.
3. 🚀 **Modular Design** – Keeps your services/controllers focused on business logic.

---

## 🧰 Utilities We Use

### `error.js`

Custom error class that extends the built-in `Error` object to provide cleaner and more informative error handling.

### `response.js`

Standardizes API responses by formatting success and error outputs consistently across the application.

### `asyncHandler.js`

A wrapper function to simplify error handling in `async/await` routes, removing the need for repetitive `try-catch` blocks.

### `cloudinary.js`

Handles file uploads to Cloudinary. If the file is missing or the upload fails, it automatically deletes the local file to prevent storage issues.

### `sendMail.js`

Uses **Nodemailer** to send emails (e.g. for password reset) and also Manages email configuration



