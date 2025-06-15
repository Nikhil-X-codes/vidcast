
# 📦 MongoDB Models Overview                                                       (Designing by -draw.io/eraser.io)

## 📘 What Are Models?

Models are **objects that define the structure of application data**. In the context of MongoDB and Mongoose, models map to collections in the database and enforce a schema for stored documents.

---

## ❓ Why Use Models?

1. ✅ **Schema Enforcement**: Ensures data consistency and validation according to application requirements.
2. 🧠 **Abstraction Layer**: Provides a simple API to interact with MongoDB, avoiding raw queries.

---

## 📂 Models Used in This Application

---

### 👤 **User Model**

Defines user data and account-related information.

#### 🧾 Fields:

- `watchhistory`: `[ObjectId]` – References to **Video** documents.
- `username`: `String` – Required, unique, trimmed, indexed.
- `email`: `String` – Required, unique.
- `fullname`: `String` – Optional, trimmed.
- `avatar`: `String` – Required.
- `coverimage`: `String` – Required.
- `password`: `String` – Required.
- `refreshToken`: `String` – Optional.
- `resetPasswordToken`: `String` – Optional.
- `resetPasswordExpire`: `Date` – Optional.
- `timestamps`: Automatic creation/update dates.

---

### 🎬 **Video Model**

Defines the structure for uploaded video content.

#### 🧾 Fields:

- `videofile`: `String` – Required.
- `thumbnail`: `String` – Required.
- `owner`: `ObjectId` – Reference to a **User**, required.
- `title`: `String` – Required, trimmed, indexed.
- `description`: `String` – Required.
- `duration`: `Number` – Required.
- `views`: `Number` – Defaults to 0.
- `ispublished`: `Boolean` – Optional.
- `timestamps`: Automatic creation/update dates.

---

### 🔔 **Subscription Model**

Represents a subscription relationship between users.

#### 🧾 Fields:

- `subscriber`: `ObjectId` – Reference to a **User**.
- `channel`: `ObjectId` – Reference to a **User**, required.
- `timestamps`: Automatic creation/update dates.

---

> ✨ With these models, our application maintains clean, validated, and well-structured data while enabling efficient querying and manipulation.

