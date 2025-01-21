import mongoose from "mongoose";
import User from "../models/auth.models.js";
import Message from "../models/messages.models.js"
import Channel from "../models/channel.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


export const createChannel = asyncHandler(async(req,res) => {
    try {
        const { name, members } = req.body;
        const userId = req.user._id;
        const admin = await User.findById(userId);
        if(!admin) {
            throw new ApiError(401, "Unauthorized user");
        }

        const validMembers = await User.find({ _id : { $in: members}});
        if(validMembers.length !== members.length){
            throw new ApiError(400, "Invalid member(s)");
        }
        const newChannel = await Channel.create({
            name,
            members: [...members, userId],
            admin: userId
        });
        await newChannel.save();
        return res.status(201).json(
            new ApiResponse(201, newChannel, "Channel created successfully")
        );
    } catch (error) {
        throw new ApiError(500,error?.message || "Internal server error");
    }
})

export const getAllChannels = asyncHandler(async(req,res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user._id);
        const channels = await Channel.find({
            members: userId
        })
        .sort({ updatedAt: -1});

        return res.status(200).json(
            new ApiResponse(200, channels, "Channels fetched successfully")
        );

    } catch (error) {
        throw new ApiError(500, error?.message || "Internal server error");
    }
})

export const getChannelMessages = asyncHandler(async(req,res) => {
    try {
        const {channelId} = req.params;
        const channel = await Channel.findById(channelId).populate({
            path: "messages",
            populate: {
                path:"sender",
                select: "firstName lastName email avatar _id age"
            }
        });

        if(!channel) {
            throw new ApiError(404, "Channel not found");
        }

        const messages = channel.messages;
        return res.status(200).json(
            new ApiResponse(200, messages, "Channel messages fetched successfully")
        );

    } catch (error) {
        throw new ApiError(500,error?.message || "Internal server error");
    }
})

export const deleteChannel = asyncHandler(async(req,res) => {
    try {
        const {channelId} = req.params;
        const userId = req.user._id;
        const channel = await Channel.findById(channelId)
        if(!channel) {
            throw new ApiError(404, "Channel not found");
        }
        if(channel.admin.toString() !== userId.toString()){
            throw new ApiError(400,"You are not Admin");
        }

        await Message.deleteMany({ _id: { $in: channel.messages } });

        const deletedChannel = await Channel.findByIdAndDelete(
            channelId
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                deletedChannel,
                "channel deleted successfully"
            )
        )

    } catch (error) {
        throw new ApiError(500,error?.message || "Internal Server error")
    }
})

export const getChannelDetails = asyncHandler(async(req,res) => {
    try {
        const {channelId} = req.params;
        const channel = await Channel.findById(channelId).populate({
            path: "members",
            select: "firstName lastName email avatar _id age"
        });
        if(!channel) {
            throw new ApiError(404, "Channel not found");
        }
        return res.status(200).json(
            new ApiResponse(200, channel, "Channel details fetched successfully")
        );
    } catch (error) {
    throw new ApiError(500,error?.message || "Internal server error");
    }
})

export const addMemberToChannel = asyncHandler(async(req,res) => {
    try {
        const {channelId} = req.params;
        const userId = req.user._id;
        const channel = await Channel.findById(channelId);
        if(!channel) {
            throw new ApiError(404, "Channel not found");
        }
        if(channel.admin.toString() !== userId.toString()){
            throw new ApiError(400,"You are not admin");
        }
        const { memberId } = req.body;
        const member = await User.findById(memberId);
        if(!member) {
            throw new ApiError(404, "Member not found");
        }
        if(channel.members.includes(memberId)){
            throw new ApiError(400, "Member already exists in the channel");
        }
        channel.members.push(memberId);
        await channel.save();
        return res.status(200).json(
            new ApiResponse(200, channel, "Member added to the channel successfully")
        );
    } catch (error) {
        throw new ApiError(500,error?.message || "Internal server error");
    }
})

export const removeMemberFromChannel = asyncHandler(async(req,res) => {
    try {
        const {channelId} = req.params;
        const userId = req.user._id;
        const {memberId} = req.body;
        const channel = await Channel.findById(channelId);
        if(!channel) {
            throw new ApiError(404, "Channel not found");
        }
        if(channel.admin.toString()!== userId.toString()){
            throw new ApiError(400,"You are not admin");
        }
        if(!channel.members.includes(memberId)){
            throw new ApiError(400, "Member not found in the channel");
        }
        channel.members = channel.members.filter(id => id.toString()!== memberId.toString());
        await channel.save();
        return res.status(200).json(
            new ApiResponse(200, channel, "Member removed from the channel successfully")
        );
    } catch (error) {
        throw new ApiError(500,error?.message || "Internal server error")
    }
})