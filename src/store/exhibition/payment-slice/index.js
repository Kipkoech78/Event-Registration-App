import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  isLoading: false,
  approvalURL: null,
  payments: [],
  eventOrderId: null,
  EventOrderDetails:null
};



export const createEventPayment = createAsyncThunk(
    "payment/createEventPayment",
    async (bookingData, {rejectWithValue}) =>{
        try{
            const response = await axios.post(`${baseURL}/api/event/create`,bookingData )
            return response.data
        }catch(e){
            return rejectWithValue(e.response?.data || e.message)
        }   
    }
)
export const capturePayment = createAsyncThunk('order/capturePayment',
    async({paymentId, payerId, orderId})=>{
   const response = 
   await axios.post(`${baseURL}/api/event/capture`,{
       paymentId, payerId, orderId
   } );
   return response.data
})


const eventOrderSlice = createSlice({
    name:"eventOrderSlice",
    initialState,
    reducers:{
        resetEventDetails:(state)=>{
            state.EventOrderDetails = null
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(createEventPayment.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(createEventPayment.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.approvalURL = action.payload.approvalURL;
            state.eventOrderId = action.payload.orderId;

            console.log( "message saved in storage", action.payload.orderId)
            sessionStorage.setItem('currentOrderId', JSON.stringify(action.payload.orderId))
        })
        .addCase(createEventPayment.rejected, (state)=>{
            state.isLoading = false;
            state.approvalURL = null;
            state.eventOrderId = null
        })
    }
})


export const {resetEventDetails} = eventOrderSlice.actions;
export default eventOrderSlice.reducer;
