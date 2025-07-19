import dotenv from "dotenv";
import connectDB from "./Db/index.js";
import app from "./app.js";


dotenv.config(
);


connectDB().then(() => {
    app.listen(process.env.PORT, () => {    
        console.log(`Server is running on port ${process.env.PORT}`);
    }
    );
}).catch((error) => {
    console.error("Error starting the server:", error);
    process.exit(1); 
}
);
   






















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

