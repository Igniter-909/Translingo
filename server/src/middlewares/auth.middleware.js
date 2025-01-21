import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken";
import User from "../models/auth.models.js"

const verifyJWT = asyncHandler(async(req,res,next) => {
    try {
        const token = req.cookies?.jwt || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(400,"Not authorized, token required");
        }
        const decodedToken = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decodedToken._id).select("-password -token");
        if(!user){
            throw new ApiError(404,"User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(400,error?.message || "Something went wrong");
    }
})

export default verifyJWT;