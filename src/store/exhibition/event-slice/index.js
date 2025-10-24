import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;


const initialState ={
    isLoading : false,
    eventList:[],
    eventDetails: null
}

export const fetchFilteredEvents = createAsyncThunk(
    "/exhibition/fetchFilteredEvents",
    async ({filterParams, sortParams}) =>{
        const query = new URLSearchParams({
            ...filterParams,
            sortBy : sortParams
        })
        const result = await axios.get(`${baseURL}/api/events/fetch-filtered?${query}`, {
        })
        return result?.data

    }
)
export const fetchEventDetailsById = createAsyncThunk(
    "/exhibition/fetchEventDetailsById",
    async (id) =>{
        const result = await axios.get(`${baseURL}/api/event/get-by-id/${id}`, {
        })
        console.log(result)
        return result?.data

    }
)
const exhibitionEventSlice = createSlice({
    name:"exhibitionEventSlice",
    initialState,
    reducers:{ setEventDetails:(state, action)=>{
        action.eventDetails = null
    } },
    extraReducers: (builder) => { 
        builder
        .addCase(fetchFilteredEvents.pending, (state,action)=>{
            state.isLoading = true;
        })
        .addCase(fetchFilteredEvents.fulfilled, (state,action)=>{
            state.isLoading = false;
            state.eventList = action.payload.data
        })
        .addCase(fetchFilteredEvents.rejected, (state,action)=>{
            state.isLoading = false;
            state.eventList =[]
        })
        .addCase(fetchEventDetailsById.pending, (state, action) =>{
            state.isLoading = true
        } )
        .addCase(fetchEventDetailsById.fulfilled, (state, action) =>{
            //console.log("Action Payload" ,action.payload.data)
            state.isLoading = false
            state.eventDetails = action.payload.data
        } )
        .addCase(fetchEventDetailsById.rejected, (state, action) =>{
            state.isLoading = false
            state.eventDetails = null
        } )

    }
})
export const {setEventDetails} = exhibitionEventSlice.actions
export default exhibitionEventSlice.reducer;