import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axiosInstance from "../../lib/axiosInstance";
import { ADDMEMBERTOCHANNEL, CREATECHANNEL, DELETECHANNEL, GETUSERCHANNELS, REMOVEMEMBERFROMCHANNEL } from "../../utils/constants";
import { toast } from "sonner";

const initialState = {
    channels:[]
};

export const createNewChannel = createAsyncThunk(
    "/channel/createChannels",
    async(data) => {
        try {
            const response = await axiosInstance.post(CREATECHANNEL,data)
            return response.data;
        } catch (error) {
            console.error(error);
            toast.error("Could not create channel")
        }
    }
)

export const getUserChannels = createAsyncThunk(
    "/channel/getUSerChannels",
    async() => {
        try {
            const response = await axiosInstance.get(GETUSERCHANNELS);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
)

export const deleteChannel = createAsyncThunk(
    "/channel/deleteChannel",
    async({channelId}) => {
        try {
            const response = await axiosInstance.delete(`${DELETECHANNEL}/${channelId}`);
            return {channelId};
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }
)

export const addMember = createAsyncThunk(
    "/channel/addMember",
    async({channelId,memberId}) => {
        try {
            const response = await axiosInstance.post(`${ADDMEMBERTOCHANNEL}/${channelId}`,{
                memberId
            });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
)

export const removeMember = createAsyncThunk(
    "/channel/removemember",
    async({channelId, memberId}) => {
        try {
            const response = await axiosInstance.post(`${REMOVEMEMBERFROMCHANNEL}/${channelId}`,{memberId});
            return response.data;
        } catch (error) {
            console.log(error);
        }
    }
)


const channelSlice = createSlice({
    name: 'channel',
    initialState,
    reducers: {
        addChannel: (state, action) => {
            state.channels.push(action.payload)
        },
        addChannelInChannelList: (state,action) => {
            const channelId = action.payload.channelId;
            const existingChannelIndex = state.channels.findIndex(
                (channel) => channel._id === channelId
            );

            if (existingChannelIndex !== -1) {
                const [channel] = state.channels.splice(existingChannelIndex, 1);
                state.channels.unshift(channel);
            }
        },
        removeChannel: (state, action) => {
            state.channels = state.channels.filter(channel => channel.id!==action.payload)
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createNewChannel.fulfilled, (state,action) => {
            state.channels.push(action.payload?.data)
        })
        builder.addCase(getUserChannels.fulfilled,(state,action)=>{
            state.channels = action.payload?.data
        })
        builder.addCase(deleteChannel.fulfilled,(state,action) => {
            const {channelId} = action.payload;
            state.channels = state.channels.filter((channel) => channel._id !== channelId)
        })
        builder.addCase(addMember.fulfilled,(state,action) => {
            const channelId = action.payload.data?._id;
            const existingChannelIndex = state.channels.findIndex(
                (channel) => channel._id === channelId
            );
            if (existingChannelIndex!== -1) {
                const [channel] = state.channels.splice(existingChannelIndex, 1);
                state.channels.unshift(channel);
            }
            state.channels[existingChannelIndex].members = action.payload.data.members;
        })
    }
 
})


export const { addChannel, removeChannel,addChannelInChannelList } = channelSlice.actions;
export default channelSlice.reducer