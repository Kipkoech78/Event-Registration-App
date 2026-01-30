import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const initialState = {
  isLoading: false,
  approvalURL: null,
  payments: [],
  mpesaData:[],
  eventOrderId: null,
  EventOrderDetails:null
};


export const createEventPayment = createAsyncThunk(
    "payment/createEventPayment",
    async (bookingData, {rejectWithValue}) =>{
        try{
            const response = await axios.post(`${baseURL}/api/event/create`,bookingData,
                {withCredentials:true}
             )
            return response.data
        }catch(e){
            return rejectWithValue(e.response?.data || e.message)
        }   
    }
)
export const CreateMpesaPayment = createAsyncThunk(
    "payment/CreateMpesaPayment",
    async (formData) =>{
        const response = await axios.post(`${baseURL}/stkpush`,formData,{withCredentials:true});
        console.log(response,"response from mpesa")
        return response.data
    }
)
export const capturePayment = createAsyncThunk('order/capturePayment',
    async({paymentId, payerId, orderId})=>{
   const response = 
   await axios.post(`${baseURL}/api/event/capture`, {
       paymentId, payerId, orderId
   }, {withCredentials:true} );
   return response.data
})

export const getEventOrderListbyUser = createAsyncThunk('event/getEventOrderListbyUser', async(userId)=>{
    const response = await axios.get(`${baseURL}/api/event/user/${userId}`, {withCredentials:true} );
    return response.data
    
})

export const getEventOrderDetails = createAsyncThunk('event/getEventOrderDetails', async(id)=>{
    const response = await axios.get(`${baseURL}/api/event/user/${id}`, {withCredentials:true} );
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
        //payment addcases
        .addCase(CreateMpesaPayment.pending, (state)=>{
            state.isLoading= true
        })
        .addCase(CreateMpesaPayment.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.mpesaData = action.payload.data;
            console.log(action.payload,"data from mpesa in addcase")
        })
        .addCase(CreateMpesaPayment.rejected, (state, action)=>{
            state.isLoading= false;
            state.mpesaData =[];
            console.log(action.payload, "mpesa rejected")
        })
        .addCase(getEventOrderListbyUser.pending, (state)=>{
            state.isLoading = true
        })
        .addCase(getEventOrderListbyUser.fulfilled, (state, action)=>{
            state.isLoading = false;
            state.payments = action.payload.data;
            console.log("getEventOrderListbyUser data", action.payload)
        })
        .addCase(getEventOrderListbyUser.rejected, (state, action) =>{
            state.isLoading = false;
            state.payments =[];
            console.log("getEventOrderListbyUser rejected", action.payload)
        })
    }
})


export const {resetEventDetails} = eventOrderSlice.actions;
export default eventOrderSlice.reducer;
