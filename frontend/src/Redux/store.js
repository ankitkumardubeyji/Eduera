import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "../Redux/authSlice"
import courseSliceReducer from "./courseSlice";
import lectureSliceReducer from "./lectureSlice";

const store = configureStore({
    reducer:{
        auth:authSliceReducer,
        course:courseSliceReducer,
        lecture:lectureSliceReducer,
    }
})


export default store;