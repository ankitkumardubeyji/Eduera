import { asyncThunkCreator, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import axios from "axios"
const  initialState = {
    coursesData: JSON.parse(localStorage.getItem("coursesData")) || []
}



export const getAllCourses = createAsyncThunk("get/courses",async()=>{
    let result =[]
    try {
        const res = axios.get("/api/v1/courses/")
        toast.promise(res,{
            loading:"wait loading the courses",
            success:(data)=>{
                result = data?.data?.data
                return data?.data?.message 
            }
        })

        await res;
        return result;
    } catch (error) {
        toast.error(error.response.data.message)
    }
})


export const getCourseLecture = createAsyncThunk("get/course/lecture",async(data)=>{
   try {
     let res = axios.get(`/api/v1/courses/lectures/${data}`)
     toast.promise(res,{
         loading:"course lectures loading...",
         success:(data)=>{
             console.log(data)
             return data?.data?.message 
         }
     })
     await res;
     return res.data
   } catch (error) {
    toast.error(error?.response?.message?.data)
   }
})


export const deleteCourseLecture = createAsyncThunk("delete/course/lecture",async(data)=>{
    
})


const courseSlice = createSlice({
    name:"course",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAllCourses.fulfilled,(state,action)=>{
            state.coursesData = action.payload
            localStorage.setItem("courseData",JSON.stringify(state.coursesData))
        })
    }
})

const {} = courseSlice.actions
export default courseSlice.reducer

