import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import axiosInstance from "../../lib/axiosInstance.js";
import { SIGNUP,LOGIN, UPDATEDETAILS, UPDATEAVATAR, GETUSERDETAILS, DELETEAVATAR, LOGOUTUSER, RESETPASSWORD } from "../../utils/constants.js";

const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    userInfo: localStorage.getItem('userInfo') != undefined ? JSON.parse(localStorage.getItem('userInfo')) : {},
};

export const signupUser = createAsyncThunk(
    "auth/signup",
    async(data) => {
        try {
            const response = await axiosInstance.post(SIGNUP,data);
            if(response.status === 200){
                toast.success("Signup successful");
            }
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    }
)

export const loginUser = createAsyncThunk(
    "auth/login",
    async(data) => {
        try {
            const response = await axiosInstance.post(LOGIN,data);
            if(response.status === 200){
                toast.success("Login successful");
            }
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error logging In")
        }
    }
)

export const updateUserDetails = createAsyncThunk(
    "auth/updateDetails",
    async(data) => {
        try {
            const response = await axiosInstance.post(UPDATEDETAILS,data);
            if(response.status === 200){
                toast.success("User Details updated successfully");
            }
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error updating User Details");
        }
    }
)

export const updateUserAvatar = createAsyncThunk(
    "/auth/updateAvatar",
    async(data) => {
        try {
            console.log(data)
            const response = await axiosInstance.post(UPDATEAVATAR,data);
            if(response.status === 200){
                toast.success("Avatar updated successfully");
            }
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error while updating the avatar")
        }
    }
)

export const getUserDetails = createAsyncThunk(
    "/auth/getUserDetails",
    async() => {
        try {
            const response = await axiosInstance.get(GETUSERDETAILS);
            if(response.status === 200){
                toast.success("User Details fetched successfully");
            }
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error while getting the user details");
        }
    }
)

export const deleteAvatar = createAsyncThunk(
    "/auth/deleteAvatar",
    async() => {
        try {
            const response = await axiosInstance.put(DELETEAVATAR);
            if(response.status === 200){
                toast.success("Avatar deleted successfully");
            }
            return response.data;
        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message || "Error while deleting the avatar");
        }
    }
)

export const logoutUser = createAsyncThunk(
    "/auth/logoutUser",
    async() => {
        try {
            const response = await axiosInstance.post(LOGOUTUSER);
            if(response.status === 200){
                toast.success("Logged out successfully");
            }
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error while logging out user");
        }
    }
)

export const resetPassword = createAsyncThunk(
    "/auth/resetPassword",

    async(data) => {
        try {
            const response = await axiosInstance.post(RESETPASSWORD,data);
            if(response.status === 200){
                toast.success("Password reset successful");
            }
            return response.data;
        } catch (error) {
            toast.error(error?.response?.data?.message || "Error while resetting the password");
        }
    }
)

const authSlice = createSlice(
    {
        name: "auth",
        initialState,
        reducers: {},
        extraReducers: (builder) => {
            builder.addCase(loginUser.fulfilled, (state,action) => {
                localStorage.setItem("isLoggedIn",true);
                localStorage.setItem("userInfo",JSON.stringify(action.payload))
                state.isLoggedIn = true;
                state.userInfo = action.payload?.data?.user;
            })
            builder.addCase(updateUserDetails.fulfilled,(state,action) => {
                localStorage.setItem("userInfo",JSON.stringify(action.payload))
                state.userInfo = action.payload?.data;
            })
            builder.addCase(updateUserAvatar.fulfilled,(state,action) => {
                localStorage.setItem("userInfo",JSON.stringify(action.payload))
                state.userInfo = action.payload?.data;
            })
            builder.addCase(getUserDetails.fulfilled,(state,action) => {
                localStorage.setItem("userInfo",JSON.stringify(action.payload))
                state.userInfo = action.payload?.data;
            })
            builder.addCase(deleteAvatar.fulfilled,(state,action) => {
                localStorage.setItem("userInfo",JSON.stringify(action.payload))
                state.userInfo = action.payload?.data;
            })
            builder.addCase(logoutUser.fulfilled,(state,action) => {
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("userInfo");
                state.isLoggedIn = false;
                state.userInfo = {};
            })
        }
    }
)

export default authSlice.reducer