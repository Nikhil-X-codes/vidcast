import asynchandler from "../utils/asynchandler.js";
import { User } from "../models/User.model.js";
import {uploadoncloudinary} from "../utils/Cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiresponse.js"; 
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";


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

    return res.status(201).json(new ApiResponse(201, "User registered successfully", newUser));
});


const loginuser = asynchandler(async (req, res) => {                                   
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    const existinguser = await User.findOne({ email });

    if (!existinguser) {
        return registeruser(req, res); 
    }

    const isPasswordValid = await existinguser.isPasswordmatch(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const {accessToken,refreshToken } = await generateAccessAndRefreshTokens(existinguser._id);

    const loggedInUser = await User.findById(existinguser._id).select("-refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                 "User logged in successfully",
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
               
            )
        );
});


const logoutuser = asynchandler(async (req, res) => {                     
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    );

    const options = {
        httpOnly: true,
        secure: true
    };

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200,"User logged out successfully", {} ));
});


const generateAccessAndRefreshTokens = async (userId) => {                      
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return {accessToken,refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
};

const refreshAccessToken = asynchandler(async (req, res, next) => {          
  try {
    const refreshTokenFromCookie = req.cookies.refreshToken;

    if (!refreshTokenFromCookie) {
      throw new ApiError(401, "Please login to continue");
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(refreshTokenFromCookie, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const user = await User.findById(decodedToken?.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.refreshToken || user.refreshToken !== refreshTokenFromCookie) {
      throw new ApiError(401, "Refresh token mismatch");
    }

    const newAccessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
      httpOnly: true,
      secure: true
    };

    return res
      .status(200)
      .cookie("accessToken", newAccessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions)
      .json(new ApiResponse(200,"Tokens refreshed successfully", { accessToken: newAccessToken, refreshToken: newRefreshToken }));
  } 
  
  catch (error) {
    next(error); 
  }})    
   
const changePassword = asynchandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body; 

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Both current and new passwords are required");
  }

  const user = await User.findById(req.user?._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.password) {
    throw new ApiError(400, "No password set for this account");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Invalid current password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully", {}));
});


const getcurrentuser = asynchandler(async (req, res) => {                                   
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200,"Current user details fetched successfully",user));
}); 


const updateUserDetails = asynchandler(async (req, res) => {
    const { username, email } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "At least one of username or email is required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (typeof username === "string") {
        user.username = username.toLowerCase();
    }

    if (typeof email === "string") {
        user.email = email.toLowerCase();
    }

    await user.save();

    res.status(200).json({
        message: "User details updated successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
        }
    });
});


const updateimages = asynchandler(async (req, res) => {
    const avatarFile = req.files?.avatar?.[0];
    const coverImageFile = req.files?.coverimage?.[0];

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }


    if (avatarFile) {
        const avatarUrl = await uploadoncloudinary(avatarFile.path);
        if (!avatarUrl) {
            throw new ApiError(500, "Failed to upload avatar to cloud storage");
        }
        user.avatar = avatarUrl;
    }

    if (coverImageFile) {
        const coverImageUrl = await uploadoncloudinary(coverImageFile.path);
        if (!coverImageUrl) {
            throw new ApiError(500, "Failed to upload cover image to cloud storage");
        }
        user.coverimage = coverImageUrl;
    }

    if (!avatarFile && !coverImageFile) {
        throw new ApiError(400, "No image provided for update");
    }

    await user.save();

    return res.status(200).json(
        new ApiResponse(200, "User image(s) updated successfully", user)
    );
});


const UserProfile = asynchandler(async (req, res) => {                                
    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "Username is required");
    }

    const channel = await User.aggregate([
        {
            $match: { username: username.toLowerCase() }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "Subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "SubscribedTo"
            }
        },
        {
            $addFields: {
                subscriberCount: { $size: "$Subscribers" },
                subscribedToCount: { $size: "$SubscribedTo" },
                isSubscribed: {
                    $in: [
                        new mongoose.Types.ObjectId(req.user?._id),
                        {
                            $map: {
                                input: "$Subscribers",
                                as: "s",
                                in: "$$s.subscriber"
                            }
                        }
                    ]
                }
            }
        },
        {
            $project: {
                username: 1,
                email: 1,
                avatar: 1,
                coverimage: 1,
                subscriberCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1
            }
        }
    ]);

    console.log("Channel Data:", channel);

    if (!channel || channel.length === 0) {
        throw new ApiError(404, "Channel not found");
    }


    res.status(200).json(new ApiResponse(200,"User profile fetched successfully",channel[0]));
});

const Watchhistory = asynchandler(async (req, res) => {
    const history = await User.aggregate([
        {
            $match: { _id: new mongoose.Types.ObjectId(req.user._id) }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchhistory",
                foreignField: "_id",
                as: "watchHistoryVideos",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "ownerDetails",
                            pipeline: [
                                {
                                    $project: {
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $unwind: {
                            path: "$ownerDetails",
                            preserveNullAndEmptyArrays: true
                        }
                    },
                    {
                        $project: {
                            title: 1,
                            thumbnail: 1,
                            views: 1,
                            duration: 1,
                            owner: "$ownerDetails",
                            video:1
                        }
                    }
                ]
            }
        },
        {
            $project: {
                watchHistoryVideos: 1,
            }
        }
    ]);

   res.status(200).json(new ApiResponse(200,"Watch history fetched successfully",history[0]?.watchHistoryVideos || []));
});
 

export { registeruser, loginuser, logoutuser,refreshAccessToken, changePassword,getcurrentuser,updateUserDetails, updateimages,UserProfile,Watchhistory };












// ---------------------------------------------------------------------------------
//  | Token         | Where Stored         | Lifetime      | Purpose               |
//  | ------------- | -------------------- | ------------- | --------------------- |
//  | Access Token  | Authorization Header | Short (5–15m) | Access to resources   |
//  | Refresh Token | HTTP-only Cookie     | Long (7–30d)  | Get new access tokens |
