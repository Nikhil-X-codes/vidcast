import asynchandler from "../utils/asynchandler.js";
import { User } from "../models/User.model.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import apiresponse from "../utils/apiresponse.js";

const registeruser = asynchandler(async (req, res) => {
 
    const { username, email, password } = req.body;


    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(409).json({ message: "User already exists" });
    }

    const avatarFile = req.files?.avatar?.[0];
    const coverImageFile = req.files?.['coverimage']?.[0];

    if (!avatarFile) {
        throw new ApiError(400, "Avatar is required");
    }

    if (!coverImageFile) {
        throw new ApiError(400, "Cover image is required");
    }

    const avatarUrl = await uploadoncloudinary(avatarFile.path);
    const coverImageUrl = await uploadoncloudinary(coverImageFile.path);

    if (!avatarUrl) {
        throw new ApiError(500, "Failed to upload avatar to cloud storage");
    }

    if (!coverImageUrl) {
        throw new ApiError(500, "Failed to upload cover image to cloud storage");
    }

    const newUser = await User.create({
        username: username.toLowerCase(),
        email,
        password,
        avatar: avatarUrl,
        coverimage: coverImageUrl
    });

    if (!newUser) {
        throw new ApiError(500, "Failed to create user");
    }

    return res.status(201).json(new apiresponse(201, "User registered successfully", newUser));
});

export { registeruser };
