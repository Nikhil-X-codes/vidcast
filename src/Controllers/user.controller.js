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

    //  console.log("Files in request:", req.files);

    //  console.log("Avatar URL:", avatarUrl);
    //  console.log("Cover Image URL:", coverImageUrl);

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

const loginuser = asynchandler(async (req, res) => {
   
    const {email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const existinguser= await User.findOne({ email });

    if(!existinguser) {
        return registeruser(req, res);
    }

    else{

        const isPasswordValid = await existinguser.isPasswordMatch(password);

        if (!isPasswordValid) {
           throw new ApiError(401, "Invalid email or password");
        }

        const accessToken = existinguser.generateAccessToken();
        const refreshToken = existinguser.generateRefreshToken();

        existinguser.refreshToken = refreshToken;
        await existinguser.save({ validateBeforeSave: false });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, 
        sameSite: "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

        return res.status(200).json(new apiresponse(200, "User logged in successfully", {
            user:existinguser,
            accessToken: accessToken
        }));
    }

});

const logoutuser=asynchandler(async (req,res)=>{

     const cookies = req.cookies;

    if (!cookies?.refreshToken) {
        return res.sendStatus(204); 
    }

    const refreshToken = cookies.refreshToken;

    const user = await User.findOne({ refreshToken });

    if (user) {
        user.refreshToken = ""; 
        await user.save();
    }

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    });

   return res.status(200).json(new apiresponse(200, "User logged out successfully"));

})



// 1) clear the refresh token from the database
// 2) clear the refresh token cookie
// 3) send a response indicating successful logout


export { registeruser, loginuser,logoutuser };
