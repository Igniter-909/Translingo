import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../lib/axiosInstance";
import { CONTACTSFORDMLIST, GETALLCONTACTS, GETCHANNELDETAILS, SEARCHCONTACT } from "../../utils/constants";
import { toast } from "sonner";

const initialState = {
  contacts: [],
  directMessagesContacts: [],
};

export const getSearchedContacts = createAsyncThunk(
  "/contact/searched",
  async (data) => {
    try {
      const response = await axiosInstance.post(SEARCHCONTACT, data);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong while searching");
    }
  }
);

export const getDirectMessagesContacts = createAsyncThunk(
  "/contact/directMessages",
  async () => {
    try {
      const response = await axiosInstance.get(CONTACTSFORDMLIST);
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong while fetching contacts list");
    }
  }
);

export const getAllContact = createAsyncThunk(
  "/contact/getallContacts",
  async () => {
    try {
      const response = await axiosInstance(GETALLCONTACTS);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const getChannelDetail = createAsyncThunk(
  "/channel/details",
  async({channelId}) => {
    try {
      const response = await axiosInstance.get(`${GETCHANNELDETAILS}/${channelId}`)
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
)

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    addDMInDMList: (state, action) => {
        const userId = action.payload.currentUserId; // The current user's ID
        const fromId =
          action.payload.sender._id === userId
            ? action.payload.recipient._id
            : action.payload.sender._id;
          
      
        const formData =
          action.payload.sender._id === userId
            ? action.payload.recipient
            : action.payload.sender;
      
        // Find if the contact already exists
        const existingContactIndex = state.contacts.findIndex(
          (contact) => contact._id === fromId
        );
      
        if (existingContactIndex !== -1) {
          // Move the contact to the top
          const [existingContact] = state.contacts.splice(existingContactIndex, 1);
          state.contacts.unshift(existingContact);
        } else {
          // Add the new contact at the top if not already present
          state.contacts.unshift(formData);
        }
        clearLocalStrorage();
      },      
      setDirectMessagesContacts: (state, action) => {
        state.directMessagesContacts = action.payload;
        clearLocalStrorage();
      },
  },
  extraReducers: (builder) => {
    builder.addCase(getSearchedContacts.fulfilled, (state, action) => {
      state.contacts = action.payload?.data;
      clearLocalStrorage();
    });
    builder.addCase(getDirectMessagesContacts.fulfilled, (state, action) => {
      state.directMessagesContacts = action.payload.data;
      clearLocalStrorage();
    });
  },
});

export const { addDMInDMList,setDirectMessagesContacts } = contactSlice.actions;
export default contactSlice.reducer;
