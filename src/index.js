import dotenv from "dotenv";
import connectDB from "./Db/index.js";

dotenv.config({
    path: "./env"
});


connectDB()























                                        // approach 1 -> to connect to mongodb

// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
// import express from "express";
// const app = express();

// const connectDB = async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
//         console.log("Connected to MongoDB successfully");

//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         });

//         app.on('error', (err) => {
//             console.error("Express app error:", err);
//             throw err;
//         });
//     } catch (error) {
//         console.error("Error connecting to MongoDB:", error);
//         throw error;
//     }
// };

// connectDB();  

