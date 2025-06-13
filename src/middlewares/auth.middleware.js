import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/User.model.js";
import jwt from "jsonwebtoken"


// it is custom middleware to verify JWT tokens in requests.if the token is valid,the request is authenticated, the user is added to req.user, and the protected route can be accessed.
// If the token is invalid or expired, it throws an error.
// Ensures only authorized users can access protected endpoints/routes.

export const verifyJWT = asynchandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        } 
        catch (error) {
            if (error.name === "TokenExpiredError") {
                throw new ApiError(401, "Access token expired");
            }
            throw new ApiError(401, "Invalid access token");
        }

        const user = await User.findById(decodedToken?.id).select("-password -refreshToken");
        if (!user) {
            throw new ApiError(401, "User not found");
        }

        req.user = user;
        next();
    } catch (error) {
        next(error); 
    }
});



