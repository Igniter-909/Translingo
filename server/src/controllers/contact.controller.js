import asyncHandler, {} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import User from "../models/auth.models.js"
import Message from "../models/messages.models.js"
import mongoose from "mongoose"

const searchContacts = asyncHandler(async(req,res) => {
    try {
        const {searchTerm} = req.body;
        if(!searchTerm){
            throw new ApiError(400, "Search term is required");
        };
        const sanitisedSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&"
        );
        const regex = new RegExp(sanitisedSearchTerm,"i");
        const contacts = await User.find({
            $and: [
                {_id: { $ne: req.user._id}},
                { $or: [{ firstName:regex},{lastName:regex},{email:regex}]}
            ]
        });
        return res.status(200).json(new ApiResponse(
            200,
            contacts,
            "Contacts found"
        ))
    } catch (error) {
        throw new ApiError(500,error?.message || "Internal server error");
    }
})

export const getAllContacts = asyncHandler(async(req,res) => {
    try {
        const users = await User.find(
            { _id : {$ne: req.user._id}},
            "firstName lastName id email"
        );

        const contacts = users.map(user => ({
          label: user.firstName ? `${user.firstName} ${user.lastName}` : user.email ,
          value: user._id 
        }))

        return res.status(200).json(new ApiResponse(
            200,
            contacts,
            "Contacts fetched successfully"
        ))


    } catch (error) {
        throw new ApiError(500,error?.message || "Internal server error");
    }
})


export const getContactsFORDMLIST = asyncHandler(async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id); // Ensure userId is an ObjectId

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{ sender: userId }, { recipient: userId }], // Match messages where the user is involved
                },
            },
            {
                $sort: { timestamp: -1 }, // Sort messages by timestamp descending
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient", // Group by the other user
                            else: "$sender",
                        },
                    },
                    lastMessageTime: { $first: "$timestamp" }, // Get the most recent message timestamp
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id", // Use the grouped user ID to find the contact info
                    foreignField: "_id",
                    as: "contactInfo",
                },
            },
            {
                $unwind: "$contactInfo", // Flatten the contactInfo array
            },
            {
                $project: {
                    _id: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    avatar: "$contactInfo.avatar",
                    age: "$contactInfo.age",
                    lastMessageTime: 1,
                },
            },
            {
                $sort: { lastMessageTime: -1 }, // Sort the results by the most recent message
            },
        ]);

        res.status(200).json(new ApiResponse(200, contacts, "Fetched successfully"));
    } catch (error) {
        throw new ApiError(500, error?.message || "Internal Server Error");
    }
});


export {searchContacts}