# 📦 Controllers in Web Applications

Controllers are key components in web applications that handle business logic. They act as a bridge between **routes** and **database models**, processing incoming requests and sending the appropriate responses.

---

## ✅ Why Use Controllers?

1. **Code Reusability**  
   Promote modular design by separating logic from routes, enabling reusable code.

2. **Encapsulation of Business Logic**  
   Simplifies maintenance by clearly organizing application functionality.

---

## ⚙️ Implementation

Controllers are typically JavaScript/TypeScript modules:
- Imported where needed (e.g., in route files)
- Exported to handle various HTTP methods (GET, POST, PUT, DELETE)

---

# 👤 User Controllers Overview

---

## 1. 🔐 Register

**Description**:  
Registers a new user.

**Required Fields**:
- `email`
- `username`
- `password` (minimum 8 characters)
- `avatar` (image)
- `coverImage` (image)

**Database**: User data is stored in **MongoDB** upon successful registration.

---

## 2. 🔓 Login

**Description**:  
Authenticates users via email and password.

**Authentication Tokens**:
- **Access Token**:  
  Stored in the `Authorization` header, expires in a few hours.
- **Refresh Token**:  
  Stored in cookies, used to obtain new access tokens.

---

## 3. 🚪 Logout

**Description**:  
Clears tokens from cookies to log the user out.

**Process**:
- Token verification via middleware
- Token deletion from cookies

---

## 4. ♻️ Refresh Access Token

**Description**:  
Generates a new access token using the refresh token stored in cookies.

**Note**:  
While in production only refresh tokens are usually stored in cookies, this project stores **both** tokens for development convenience.

---

## 5. 🔁 Change Password

**Description**:  
Allows users to change their password securely.

**Validation**:
- Old password match
- New and confirm passwords must match

---

## 6. 🧾 Get User Details

**Description**:  
Fetches user data based on their MongoDB `_id`.

---

## 7. 🆘 Forgot Password

**Description**:  
Sends a password reset link to the user’s registered email address.

---

## 8. ✏️ Update User Info and Images

**Description**:  
Users can update the following fields:
- `username`
- `email`

> In production systems, image uploads are typically handled by dedicated controllers or services.

---

# 🎞️ Video Controllers Overview

---

## 1. ⬆️ Upload Video

**Description**:  
Users can upload a video with required metadata.

**Required Fields**:
- `title` (string)
- `description` (string)
- `thumbnail` (image file)
- `video` (video file)

---

## 2. ❌ Delete Video

**Description**:  
Deletes a video using its `videoId`.



---

## 3. 📝 Update Video Details

**Description**:  
Allows updating only the `title` and `description`.

❗ Thumbnail image **cannot** be updated.

---

## 4. 🔍 Get Videos (Search + Pagination)

**Description**:  
Returns a list of videos based on query parameters.

**Query Parameters**:
- `search`: text in `title` or `description`
- `page`: pagination page (default: 1)
- `limit`: number of results per page (default: 10)
- `userId`: filter videos by user

---

## 5. 📄 Get Single Video

**Description**:  
Fetches a video’s complete details using its `videoId`.


## 🧩 Developer Note

In production-grade systems:
- Controller logic is often separated into **service layers**.
- This improves **scalability**, **testability**, and **maintainability**.

