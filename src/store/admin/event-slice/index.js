const baseURL = import.meta.env.VITE_API_BASE_URL;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  EventList: [],
  summaryList:[]
};
export const addNewEvent = createAsyncThunk(
  "/events/addNewEvent",
  async (formData) => {
    const result = await axios.post(`${baseURL}/api/event/add`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result?.data;
  }
);
export const fetchAllEvents = createAsyncThunk(
  "/events/fetchAllEvents",
  async () => {
    const result = await axios.get(`${baseURL}/api/event/get-all`, {});
    return result?.data;
  }
);
export const fetchEventsSummary = createAsyncThunk(
  "/events/fetchEventsSummary",
  async () => {
    const result = await axios.get(`${baseURL}/api/event/summary`, {});
    return result?.data;
  }
);

export const editEvents = createAsyncThunk(
  "/events/editEvents",
  async ({ id, formData }) => {
    const result = await axios.put(`${baseURL}/api/event/edit/${id}`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result?.data;
  }
);
export const deleteEvents = createAsyncThunk(
  "/products/deleteEvents",
  async (id) => {
    const result = await axios.delete(`${baseURL}/api/event/delete/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result?.data;
  }
);
const AdminEventSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEvents.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        console.log(action.payload.data);
        state.isLoading = false;
        state.EventList = action.payload.data;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.EventList = [];
      })
      .addCase(fetchEventsSummary.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEventsSummary.fulfilled, (state, action) => {
        console.log(action.payload.data);
        state.isLoading = false;
        state.summaryList = action.payload.data;
      })
      .addCase(fetchEventsSummary.rejected, (action, state) => {
        state.isLoading = false;
        state.summaryList = [];
      });
  },
});

export default AdminEventSlice.reducer;
