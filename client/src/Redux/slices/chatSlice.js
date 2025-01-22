import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import {toast} from "sonner"
import axiosInstance, {} from "../../lib/axiosInstance.js"
import { GETCHANNELMESSAGES, GETMESSAGE, UPLOADFILE } from "../../utils/constants.js"
import { clearLocalStrorage } from "./authSlice.js"

const initialState = {
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages:[],
}

export const getAllMessages = createAsyncThunk(
    "/chat/getMessages",
    async(data) => {
        try {
            const response = await axiosInstance.post(GETMESSAGE,data);
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }
)

export const getChannelMessagesData = createAsyncThunk(
    "/channel/getMessagesData",
    async({channelId}) => {
        try {
            const response = await axiosInstance.get(`${GETCHANNELMESSAGES}/${channelId}`);
            return response.data;
        } catch (error) {
            console.log(error)
        }
    }
)


export const fileUpload = createAsyncThunk(
    "/chat/fileUpload",
    async(data) => {
        try {
            const response = await axiosInstance.post(UPLOADFILE,data);
            toast.success("successfully uploaded")
            return response.data;
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message);
        }
    }
)


const chatSlice = createSlice({
    name:'chat',
    initialState,
    reducers:{
        setSelectedChatType: (state,action) => {
            state.selectedChatType = action.payload
            clearLocalStrorage();
        },
        setSelectedChatData: (state,action) => {
            state.selectedChatData = action.payload
            clearLocalStrorage();
        },
        setSelectedChatMessages: (state,action) => {
            state.selectedChatMessages = action.payload
            clearLocalStrorage();
        },
        addChatMessage: (state,action) => {
            state.selectedChatMessages.push({
                ...action.payload,
                recipient: state.selectedChatType === "channel" ? 
                    action.payload.recipient : 
                    action.payload.recipient._id,
                sender: state.selectedChatType === "channel" ?
                    action.payload.sender :
                    action.payload.sender._id,
            })
            clearLocalStrorage();
        },
        closeChat: (state) => {
            state.selectedChatType = undefined
            state.selectedChatData = undefined
            state.selectedChatMessages = []
            clearLocalStrorage();
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAllMessages.fulfilled,(state,action) => {
            state.selectedChatMessages = action.payload?.data
            clearLocalStrorage();
        })
        builder.addCase(getChannelMessagesData.fulfilled,(state,action) => {
            state.selectedChatMessages = action.payload?.data
            clearLocalStrorage();
        })
    }
})

export const {setSelectedChatData,setSelectedChatType,setSelectedChatMessages,addChatMessage,closeChat} = chatSlice.actions;
export default chatSlice.reducer