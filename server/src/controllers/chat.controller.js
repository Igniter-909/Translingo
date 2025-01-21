import asyncHandler, {} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import Message, {} from "../models/messages.models.js"
import uploadOnCloudinary from "../utils/cloudinary.js"


const getMessages = asyncHandler(async(req,res) => {
    try {
        const user1 = req.user._id;
        const user2 = req.body.id;
        if(!user1 || !user2){
            throw new ApiError(400,"Both user IDs are required");
        }
        const messages = await Message.find({
            $or: [
                {sender: user1,recipient:user2},
                { sender:user2,recipient:user1}
            ],
        }).sort({timestamp: 1});
        return res.status(200).json(new ApiResponse(
            200,
            messages,
            "Messages retrieved successfully"
        ))
    } catch (error) {
        throw new ApiError(500,error?.message || "Internal server error");
    }
})

const uploadFile = asyncHandler(async(req,res) => {
    try {
        const filePath = req.files?.file[0]?.path;
        if(!filePath){
            throw new ApiError(400,"File is required");
        }
        const file = await uploadOnCloudinary(filePath);
        if(!file){
            throw new ApiError(400,"File failed to upload on cloudinary");
        }
        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    file.url,
                    "File successfully uploaded"
                )
            )
    } catch (error) {
        throw new ApiError(500,error?.message || "Internal server error")
    }
})

export {getMessages,uploadFile};