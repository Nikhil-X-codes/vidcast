## 📘 What is a Database?

A **database (DB)** is a structured system for storing **raw data (information)** in a way that it can be **easily accessed, updated, or deleted**.

---

## 🗂️ Types of Databases:

### 🔹 Relational Databases
- Store data in **organized, tabular format** (rows and columns).
- **Examples**: MySQL, PostgreSQL

### 🔹 Non-Relational (NoSQL) Databases
- Store data in **key-value pairs**, **documents**, or **collections**.
- Not structured like tables; often use a **JSON-like format**.
- **Examples**: MongoDB, Firebase

---

## 💡 Why Use a Database?

✅ **Efficient Data Management**  
Organizes and handles large volumes of data effectively.

🔍 **Built-in Operations**  
Supports powerful operations like **querying**, **searching**, **updating**, and **deleting**.

🔐 **Enhanced Security**  
Protects sensitive information (e.g., passwords, tokens) using **encryption** and **access control**.

---

## 🔧 How is a Database Used in Applications?

In a **Node.js application**, we commonly use **MongoDB** (a NoSQL database) in combination with the **Mongoose** library.

- **Mongoose** is an **ODM (Object Data Modeling)** library that connects your Node.js app to MongoDB.
- It helps define **schemas**, enforce **validation**, and perform database operations in a clean, organized way.

### 🛠️ Example:
```js
mongoose.connect(`${process.env.MONGO_URI}/your_db_name`);
