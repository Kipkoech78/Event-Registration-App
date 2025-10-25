import { configureStore }  from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index"
import AdminEventsSlice from "./admin/event-slice/index"
import exhibitionEventSlice from "./exhibition/event-slice/index"
import eventOrderSlice from "./exhibition/payment-slice/index"

const store = configureStore({
    reducer:{
        auth: authReducer,
        adminEvents: AdminEventsSlice,
        exhibitionEvent:exhibitionEventSlice,
        payment: eventOrderSlice,

    }
})

export default store;