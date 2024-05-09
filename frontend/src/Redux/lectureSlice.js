import { createSlice } from "@reduxjs/toolkit"
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import toast from "react-hot-toast";

const initialState={
  lectures:JSON.parse(localStorage.getItem("lectures"))||[]
}


const lectureSlice = createSlice({
    name:"lecture",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getCourseLecture.fulfilled,(state,action)=>{
            state.lectures = action.payload
            console.log(state.lectures)
        })
    }
});


export const getCourseLecture = createAsyncThunk("get/course/lecture",async(data)=>{
   let result = []
    try {
      let res = axios.get(`/api/v1/courses/lectures/${data}`)
      toast.promise(res,{
          loading:"course lectures loading...",
          success:(data)=>{
              result = data?.data?.data
              return data?.data?.message 
          }
      })
      await res;
      return result
    } catch (error) {
     toast.error(error?.response?.message?.data)
    }
 })

 export const addCourseLecture = createAsyncThunk("add/course/lecture",async(data)=>{
   
    const formData = new FormData();
    formData.append("lecture", data.lecture);
    formData.append("title", data.title);
    formData.append("description", data.description);

    const res = axios.patch(`/api/v1/courses/add/lecture/${data.id}`,formData)
    toast.promise(res,{
        loading:"wait adding lecture!",
        success:(data)=>{
            console.log(data)
            return data?.data?.message 
        }
    })
 })
 
 
 export const deleteCourseLecture = createAsyncThunk("delete/course/lecture",async(data)=>{
  try {
       const res = axios.delete(`/api/v1/courses/delete/lecture/${data.courseId}/${data.lectureId}`)
       toast.promise(res,{
          loading:"wait deleting the lecture",
          success:(data)=>{
              console.log(data)
              return data?.data?.message 
          }
       })
       await res;
       return res.data 
  } catch (error) {
    toast.error(error.response.data.message)
  }

     
 })
 
 

const {} = lectureSlice.actions
export default lectureSlice.reducer
