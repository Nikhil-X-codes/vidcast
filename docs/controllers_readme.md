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
- `username`  (always in small letter)
- `password` 
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
Clears tokens from cookies to log the user out.it automatically Logout after 20-30 min.


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

## 7. ✏️ Update User Info and Images

**Description**:  
Users can update the following fields:
- `username`

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

---

## 6. 📄 Get Search Video based on Query

**Description**:  
Fetches a video’s Based on title and Description.


## ❤️ Like Functionality

- **Like a video**  
  Allows a user to like a specific video but like count shows only when user hit like.


- **Get all liked videos**  
  Retrieves all videos liked by the current user.

---

## 💬 Comment Functionality

- **Add comment**  
  Adds a comment to a specified video but comment count shows only when user comments.

- **Delete comment**  
  Deletes a comment made by the user.

- **Edit comment**  
  Updates the content of an existing comment.

---

## 📂 Playlist Functionality

- **Add playlist**  
  Creates a new playlist for organizing videos.

- **Remove playlist**  
  Deletes an existing playlist created by the user.

- **Update playlist**  
  Modifies the name and description of a playlist.

- **Add video to playlist**  
  Adds a video to a selected playlist.

- **Remove video from playlist**  
  Removes a video from a selected playlist.

- **Get a playlist**  
  Fetches all videos and details of a given playlist.

- **Get a playlist**  
  Fetches all playlists.

---

## 🔔 Subscription Functionality

- **Toggle the subscribe button**  
  Subscribes the user to a channel if not already subscribed, or unsubscribes if already subscribed and user cannot subscribed to yourself.

- **Get number of channels subscribed by user**  
  Returns the total number of channels the current user is subscribed to.

- **Get number of subscribers of a channel**  
  Returns the total number of subscribers for a specific channel.


