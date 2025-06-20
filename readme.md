# 🎥 VidCast

VidCast is a dynamic video streaming platform similar to YouTube. Users can register, log in, search videos, manage personal playlists, view history, and subscribe to their favorite creators.

---

## 🌐 Tech Stack

- 🟢 **MongoDB** – NoSQL Database
- ⚙️ **Express.js** – Backend Web Framework
- ⚛️ **React.js** – Frontend Library
- 🌐 **Node.js** – Runtime Environment

---

## 📦 Key Libraries

### 👉 **Dependencies (For production)**
| Package         | Description                           |
|-----------------|---------------------------------------|
| `bcrypt`        | Password hashing                      |
| `cloudinary`    | Cloud storage for video/image assets  |
| `cookie-parser` | Parses cookies in request headers     |
| `dotenv`        | Loads environment variables           |
| `jsonwebtoken`  | JWT-based user authentication         |
| `mongoose`      | ODM for MongoDB                       |
| `multer`        | Middleware for file uploads           |
                        |

### 🔧 **devDependencies (For development only)**
| Package     | Description                            |
|-------------|----------------------------------------|
| `nodemon`   | Auto-restart server on file changes    |

---

## 🚀 Features

- ✅ JWT-based User Authentication  
- ✅ Video Search Functionality  
- ✅ Playlist & Watch History Management  
- ✅ Creator Subscriptions  
- ✅ Cloudinary Video Upload Support  
- ✅ RESTful APIs  
- ✅ Error Handling  
- ✅ Form Validation  
- ✅ Responsive UI  
- ✅ MongoDB ODM via Mongoose  

---

## 📁 Project Structure

```
VidCast/
├── client/            # React Frontend
├── server/            # Node + Express Backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   └── utils/
├── .env               # Environment variables
├── .gitignore
└── README.md

```
# Step 1: Clone the repository
git clone https://github.com/Nikhil-X-codes/vidcast.git

# Step 2: Backend setup
cd vidcast/server
npm install
touch .env   # Add environment variables here

# Step 3: Frontend setup
cd ../client
npm install

# Step 4: Run the app

# Start backend
cd ../server
npm run dev

# Start frontend
cd ../client
npm start

