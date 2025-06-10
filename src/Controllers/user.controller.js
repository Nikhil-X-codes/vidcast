import asynchandler from "../utils/asynchandler.js";
import {User} from "../models/User.model.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import apiresponse from "../utils/apiresponse.js";


const registeruser= asynchandler(async (req, res) => {
  
    const { username, email, password,avatar, coverimage } = req.body;

    if(!username || !email || !password || !avatar || !coverimage) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.find({email})
    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
    }


    const avatarFile = req.files?.avatar?.[0];
    const coverImageFile = req.files?.['coverimage']?.[0]
    
        if (!avatarFile) {
        throw new ApiError(400, "Avatar is required");
        }

    if (!coverImageFile) {
        throw new ApiError(400, "Cover image is required");
    }

    const avatarUrl = await uploadoncloudinary(avatarFile.path);
    const coverImageUrl = await uploadoncloudinary(coverImageFile.path);

    if(!avatarUrl && !coverImageUrl) {
        throw new ApiError(500, "Failed to upload images to cloud storage");
    }

    const newUser = await User.create({
        username: username.tolowerCase(),
        email,
        password,
        avatar: avatarUrl,
        coverimage: coverImageUrl
    });

    if (!newUser) {
        throw new ApiError(500, "Failed to create user");
    }

 return res.status(201).json(new apiresponse(201, "User registered successfully",newUser));

})

export default registeruser;





// controller-> it is a function that handles the request and response objects. It contains the business
//  logic for the application. It is responsible for processing the request, interacting with the database,
//  and sending the response back to the client.








// sceneniros for userregister-

// 1) Receives user registration data (username, email, password, etc.)           

// 2) Validates the input data                                                    

// 3) Checks if the user already exists on basis of email                       

// 4) Hashes the password (never store plain passwords!)                          

// 5) Creates a new user record/object/entry in the database                            

// 6) May generate authentication tokens or send verification emails              

// 7) Returns appropriate responses to the client if not then give error message

// 8) check for avatar and cover image and upload to cloud storage if provided and if not provided 







// This code sets up a user registration route that:

// 1) Requires two image files (avatar and coverimage)
// 2) Validates their presence
// 3) Uploads them to cloud storage
// 4) Fails gracefully if something goes wrong