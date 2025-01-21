import User from "../models/auth.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import uploadOnCloudinary, { deleteFromCloudinary } from "../utils/cloudinary.js";

const signup = asyncHandler(async(req,res) => {
    try {
        const {email, password} = req.body;
        if(!email){
            throw new ApiError(400, "Email is required");
        }
        if(!password){
            throw new ApiError(400, "Password is required");
        }
        const existedUser = await User.findOne({ email});
        if(existedUser){
            throw new ApiError(400, "Email already exists");
        };
        const user = await User.create({
            email,
            password
        });
        const createdUser = await User.findById(user._id);
        if(!createdUser){
            throw new ApiError(500, "Failed to create user");
        }

        return res.
            status(200)
            .json(
                new ApiResponse(200,createdUser,"User created successfully")
            );
    } catch (error) {
        console.log(error)
        throw new ApiError(500,error.message || "Internal server error");
    }
})

const login = asyncHandler(async(req,res) => {
    try {
        const {email, password} = req.body;
        if(!email){
            throw new ApiError(400, "Email is required");
        }
        if(!password){
            throw new ApiError(400, "Password is required");
        }
        const user = await User.findOne({email});
        if(!user){
            throw new ApiError(401, "Email not found");
        }
        const isPasswordCorrect = await user.isPasswordCorrect(password);
        if(!isPasswordCorrect){
            throw new ApiError(401, "Incorrect password");
        }
        const token = await user.generateToken();
        const loggedInUser = await User.findById(user._id).select("-password -token");

        const options = {
            maxAge : 24 * 60 * 60 * 1000 * 7,
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }

        return res
        .status(200)
        .cookie("jwt",token,options)
        .json(
            new ApiResponse(
                200,
                {
                    user:loggedInUser,
                    token
                },
                "Log in successful"
            )
        );

    } catch (error) {
        throw new ApiError(500, error.message || "Internal server error");
    }
})

const updateDetails = asyncHandler(async(req,res) => {
    try {
        const {firstName, lastName, age} = req.body;
        if(!firstName && !lastName &&!age){
            throw new ApiError(400, "At least one field must be updated");
        }
        const userId = req.user._id;
        const user = await User.findByIdAndUpdate(
            userId,
            {
                firstName,
                lastName,
                age
            },
            { new: true }
        );
        if(!user){
            throw new ApiError(404, "User not found");
        };
        await user.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                user,
                "User details updated successfully"
            )
        )

    } catch (error) {
        throw new ApiError(500, error.message || "Internal server error");
    }
})

const updateAvatar = asyncHandler(async(req,res) => {
    try {
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(401, "Unauthorized User");
        }
        const avatarFilePath = req.files?.avatar[0]?.path;
        if(!avatarFilePath){
            throw new ApiError(400, "Invalid avatar file");
        }
        const avatar = await uploadOnCloudinary(avatarFilePath);
        if(!avatar){
            throw new ApiError(400, "Failed to upload avatar to cloudinary");
        }
        const user = await User.findByIdAndUpdate(
            userId,
            {
                avatar:avatar.url
            },
            {new:true}
        )
        if(!user){
            throw new ApiError(404, "User not found");
        }
        await user.save();
        
        return res.status(200).json(
            new ApiResponse(200,
                user,
            "Avatar updated successfully!!!")
        )
    } catch (error) {
        throw new ApiError(500,error?.message || "Internal server error");
    }
})

const getUserDetails = asyncHandler(async(req,res) => {
    try {
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(401, "Unauthorized User");
        }
        const user = await User.findById(userId).select("-password -token");
        if(!user){
            throw new ApiError(404, "User not found");
        }
        return res.status(200).json(
            new ApiResponse(200,user,"User details retrieved successfully")
        )
    } catch (error) {
        throw new ApiError(500,error?.message ||  "Internal server error");
    }
})

const deleteAvatar = asyncHandler(async(req,res) => {
    try {
        const userId = req.user._id;
        if(!userId){
            throw new ApiError(401, "Unauthorized User");
        }
        const user = await User.findByIdAndUpdate(
            userId,
            {
                avatar: null
            },
            {new: true}
        );
        if(!user){
            throw new ApiError(404, "User not found");
        }
        await user.save();
        const deletedAvatarUrl = user.avatar;
        if(deletedAvatarUrl){
            await deleteFromCloudinary(deletedAvatarUrl);
        }
        
        return res.status(200).json(
            new ApiResponse(200,user,"Avatar deleted successfully!!!")
        )
    } catch (error) {
        throw new ApiError(500,error?.message  || "Internal server error")
    }
})

const logout = asyncHandler(async(req,res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset:{
                    token:1
                }
            },
            {
                new: true
            }
        );
        if(!user){
            throw new ApiError(404, "User not found");
        }
        const options = {
            maxAge : 0,
            httpOnly: true,
            secure: true,
            sameSite: "None"
        }
        return res
            .status(200)
            .clearCookie("jwt",options)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Logged out successfully"
                )
            )
    } catch (error) {
        throw new ApiError(500,error?.message || "Internal server error");
    }
})

const forgotPassword = asyncHandler(async(req,res) => {
    try {
        const {email,age} = req.body;
        if(!email){
            throw new ApiError(400, "Email is required");
        }
        const user = await User.findOne({email:email});
        if(!user){
            throw new ApiError(404, "User not found");
        }
        if(user.age!== age){
            throw new ApiError(400, "Incorrect age");
        }
        const {newPassword} = req.body;
        if(!newPassword){
            throw new ApiError(400, "New password is required");
        }
        user.password = newPassword;
        await user.save();
        return res.status(200).json(
            new ApiResponse(
                200,
                {},
                "Password reset successfully. You can now log in with the new password."
            ))

    } catch (error) {
        throw new ApiError(500,error?.message || "Internal server error")
    }
})

export {signup,login,updateDetails,updateAvatar,deleteAvatar,getUserDetails,logout,forgotPassword};