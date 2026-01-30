const baseURL = import.meta.env.VITE_API_BASE_URL;
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  // isLoading: false,
  orderList: [],
  orderDetails: null,
};
export const getALlUserOrderList = createAsyncThunk(
  "order/getALlUserOrderList",
  async () => {
    const response = await axios.get(
      `${baseURL}/api/event/attendees`
    );
  
    return response.data;
    
  }
);



export const getAdminOrderDetails = createAsyncThunk(
  "order/getAdminOrderDetails",
  async (id) => {
    const response = await axios.get(
      `${baseURL}/api/event/attendee/${id}`
    );
    return response.data;
  }
);
export const updateOrderStatus = createAsyncThunk(
    "order/updateOrderStatus",
    async ({id, orderStatus}) => {
      const response = await axios.put(
        `${baseURL}/api/shop/order/admin/update/${id}`,
        {orderStatus}
      );
      return response.data;
    }
  );


const adminOrderSlice = createSlice({
  name: "adminOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state)=>{
        state.orderDetails = null
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(getALlUserOrderList.pending, (state)=>{ state.isLoading = true})
    .addCase(getALlUserOrderList.fulfilled, (state, action)=>{
        state.isLoading = false;
        state.orderList = action.payload.data;

    })
    .addCase(getALlUserOrderList.rejected, (state)=>{
        state.isLoading = false;
        state.orderList =null;
    })

      .addCase(
        getAdminOrderDetails.pending, (state) => {
            state.isLoading = true
        } )
      .addCase(getAdminOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getAdminOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});
export const {resetOrderDetails} = adminOrderSlice.actions;
export default adminOrderSlice.reducer;
