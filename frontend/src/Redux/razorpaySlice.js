import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axios from "axios"

const initialState = {
  key: "",
  subscription_id: "",
  isPaymentVerified: false,
  allPayments: {},
  finalMonths: {},
  monthlySalesRecord: [],
};

// function to get the api key
export const getRazorPayId = createAsyncThunk("/razorPayId/get", async () => {
    let result = ""
  try {
    const res = axios.get("api/v1/payments/razorpay-key");
    toast.promise(res,{
        loading:"wait getting the razorpay key",
        success:(data)=>{
            result  = data?.data?.data?.key
            return data?.data?.message

        }
    })
    await res;
    return result;
  } catch (error) {
    toast.error("Failed to load data");
    console.log(error+"here in get")
  }
});

// function to purchase the course bundle
export const purchaseCourseBundle = createAsyncThunk(
  "/purchaseCourse",
  async () => {
    let result = ""
    try {
      const res =  axios.post("api/v1/payments/subscribe");
      toast.promise(res,{
        loading:"wait paying !",
        success:(data)=>{
            result = data?.data?.data?.subscription_id
            console.log(result)
            return data?.data?.message 
        }
      })
      await res;
      return result;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error +"here in purchase")
    }
  }
);

// function to verify the user payment
export const verifyUserPayment = createAsyncThunk(
  "/verifyPayment",
  async (paymentDetail) => {
    try {
      const res =  axios.post("api/v1/payments/verify", {
        razorpay_payment_id: paymentDetail.razorpay_payment_id,
        razorpay_subscription_id: paymentDetail.razorpay_subscription_id,
        razorpay_signature: paymentDetail.razorpay_signature,
      });

      toast.promise(res,{
        loading:"wait verifying your payment status",
        success:(data)=>{
            console.log(data)
            return data?.data?.message 
        }
      })
      return res?.data;
    } catch (error) {
      toast.error("error?.response?.data?.message");
    }
  }
);

// function to get all the payment record
export const getPaymentRecord = createAsyncThunk("paymentrecord", async () => {
  try {
    const res = axios.get("/payments?count=100");
    toast.promise(res, {
      loading: "Getting the payments record...",
      success: (data) => {
        return data?.data?.message;
      },
      error: "Failed to get payment records",
    });

    const response = await res;
    return response.data;
  } catch (error) {
    toast.error("Operation failed");
  }
});

// function to cancel the course bundle subscription
export const cancelCourseBundle = createAsyncThunk(
  "/cancelCourse",
  async () => {
    try {
      const res = axios.post("/payments/unsubscribe");
      toast.promise(res, {
        loading: "Unsubscribing the bundle...",
        success: "Bundle unsubscibed successfully",
        error: "Failed to unsubscibe the bundle",
      });
      const response = await res;
      return response.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

const razorpaySlice = createSlice({
  name: "razorpay",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRazorPayId.rejected, () => {
        toast.error("Failed to get razor pay id");
      })
      .addCase(getRazorPayId.fulfilled, (state, action) => {
        state.key = action.payload;
      })
      .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
        console.log(action.payload)
        state.subscription_id = action.payload
      })
      .addCase(verifyUserPayment.fulfilled, (state, action) => {
        toast.success(action?.payload?.message);
        state.isPaymentVerified = action?.payload?.success;
      })
      .addCase(verifyUserPayment.rejected, (state, action) => {
        toast.error(action?.payload?.message);
        state.isPaymentVerified = action?.payload?.success;
      })
      .addCase(getPaymentRecord.fulfilled, (state, action) => {
        state.allPayments = action?.payload?.allPayments;
        state.finalMonths = action?.payload?.finalMonths;
        state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
      });
  },
});

export const {} = razorpaySlice.actions;
export default razorpaySlice.reducer;
