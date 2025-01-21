import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import contactReducer from "./slices/contactSlice.js"
import chatReducer from "./slices/chatSlice.js"
import channelReducer from "./slices/channelSlice.js"

const store = configureStore(
    {
        reducer:{
            auth : authReducer,
            contact: contactReducer,
            chat: chatReducer,
            channel: channelReducer
        },
        devTools: true
    }
)

export default store;