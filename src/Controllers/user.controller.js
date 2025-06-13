import asynchandler from "../utils/asynchandler.js";
import { User } from "../models/User.model.js";
import uploadoncloudinary from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiresponse.js"; 

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

export { registeruser, loginuser, logoutuser,refreshAccessToken };












// ---------------------------------------------------------------------------------
//  | Token         | Where Stored         | Lifetime      | Purpose               |
//  | ------------- | -------------------- | ------------- | --------------------- |
//  | Access Token  | Authorization Header | Short (5–15m) | Access to resources   |
//  | Refresh Token | HTTP-only Cookie     | Long (7–30d)  | Get new access tokens |
