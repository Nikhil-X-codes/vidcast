import asynchandler from "../utils/asynchandler"
import jwt from JsonWebTokenError
import ApiError from "../utils/ApiError";

export const verifyjwt = asynchandler(async(req,res,next)=>{
  
    const {token} = req.cookies;

        if (!token) {
        res.status(401);
        throw new ApiError('Unauthorized: No token found');
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = decoded; 
        next();
    } 
    
    catch (error) {
        res.status(403);
        throw new ApiError('Forbidden: Invalid or expired token');
    }

})