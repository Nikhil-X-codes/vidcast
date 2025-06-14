import asynchandler from "../utils/asynchandler.js";
import { User } from "../models/User.model.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiresponse.js"; 
import jwt from "jsonwebtoken";
import sendEmail from "../utils/Sendmail.js";

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


const loginuser = asynchandler(async (req, res) => {                                    // generate access and refresh tokens when user logs in
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

    const loggedInUser = await User.findById(existinguser._id).select("-password -refreshToken");

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
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        );
});



const logoutuser = asynchandler(async (req, res) => {                    // this function logs out the user by clearing the refresh token from the database and clearing cookies
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
        .json(new ApiResponse(200, {}, "User logged out successfully"));
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

const refreshAccessToken = asynchandler(async (req, res, next) => {          // this function refreshes the access token using the refresh token stored in cookies 
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
      .json(new ApiResponse(200, { accessToken: newAccessToken, refreshToken: newRefreshToken }, "Tokens refreshed successfully"));
  } 
  
  catch (error) {
    next(error); 
  }})    
   

 const changePassword = asynchandler(async (req, res) => {                              // this function changes the user's password after verifying the old password
    const { oldpassword, newpassword, confirmpassword } = req.body;

    if (!oldpassword || !newpassword || !confirmpassword) {
        throw new ApiError(400, "All password fields are required");
    }

    if (newpassword !== confirmpassword) {
        throw new ApiError(400, "New password and confirm password do not match");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isMatch = await user.isPasswordmatch(oldpassword);
    if (!isMatch) {
        throw new ApiError(401, "Old password is incorrect");
    }

    user.password = newpassword;
    await user.save({ validateBeforeSave: true });

    return res.status(200).json(
        new ApiResponse(200, {}, "Password changed successfully")
    );
});

const getcurrentuser = asynchandler(async (req, res) => {                                   // this function returns the current user details
    const user = await User.findById(req.user._id).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(new ApiResponse(200, user, "Current user details fetched successfully"));
}); 

const forgetPassword = asynchandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        res.status(400);
        throw new Error("Please provide an email");
    }

    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("User not found");
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 

    await user.save();

   const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetpassword/${resetToken}`;

    const message = `
        <h2>Password Reset Request</h2>
        <p>If you requested a password reset, click the link below:</p>
        <a href="${resetUrl}" target="_blank">${resetUrl}</a>
        <p>This link will expire in 10 minutes.</p>
    `;

    try {
        await sendEmail({
            to: user.email,
            subject: "Password Reset",
            html: message
        });

        res.status(200).json({
            success: true,
            message: "Password reset link sent to email"
        });
    } catch (error) {

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(500);
        throw new Error("Email could not be sent. Try again later.");
    }
});


const updateUserDetails = asynchandler(async (req, res) => {                                  // this function updates the user's username and email
    const { username, email } = req.body;

    if (!username || !email) {
        throw new ApiError(400, "Username and email are required");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    user.username = username.toLowerCase();
    user.email = email.toLowerCase();

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


const updateimages = asynchandler(async (req, res) => {                                              // this function updates the user's avatar and cover image

    const avatarFile = req.files?.avatar?.[0];
    const coverImageFile = req.files?.['coverimage']?.[0];

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
    return res.status(200).json(new ApiResponse(200, user, "User image(s) updated successfully"));
});







  
   

export { registeruser, loginuser, logoutuser,refreshAccessToken, changePassword,forgetPassword, getcurrentuser,updateUserDetails, updateimages };












// ---------------------------------------------------------------------------------
//  | Token         | Where Stored         | Lifetime      | Purpose               |
//  | ------------- | -------------------- | ------------- | --------------------- |
//  | Access Token  | Authorization Header | Short (5–15m) | Access to resources   |
//  | Refresh Token | HTTP-only Cookie     | Long (7–30d)  | Get new access tokens |
