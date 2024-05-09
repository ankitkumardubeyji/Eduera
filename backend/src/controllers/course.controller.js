import { confirmPasswordReset } from "firebase/auth";
import Course from "../models/course.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, getPublicIdFromUrl, uploadOnCloudinary } from "../utils/cloudinary.js";


const getAllCourses = asyncHandler(async(req,res)=>{
    try{
        const courses = await Course.find({}).select('-lectures')

       return  res.status(200)
        .json(new ApiResponse(200,courses,"All courses fetched successfully !"))
    }

    catch(err){
        throw new ApiError(400,err)
    }
})


const getLecturesByCourseId = async function(req,res,next){
    try{
        const {id} = req.params
        const course = await Course.findById(id);

        if(!course){
            throw new ApiError(400,"invalid course id ")
        }

        return res.status(200)
        .json(new ApiResponse(200,course.lectures,"lectures of the course fetched successfully "))
    }
    catch(err){
        throw new ApiError(400,err)
    }
}


const createCourse = asyncHandler(async(req,res)=>{
    console.log(req.body)
    const {title,category,description,createdBy} = req.body
    console.log(req.body)

    if(!title || !category || !description || !createdBy){
        throw new ApiError(400,"all fields are required")
    }

    const thumbnailLocalFile = req.files.thumbnail[0].path

    if(!thumbnailLocalFile){
        throw new ApiError(400,"Please provide thumbnail for the course")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalFile)

    if(!thumbnail){
        throw new ApiError(400,"thumbnail could nt be uploaded on cloudinary")
    }

    const thumbnailUrl = thumbnail.url
    const thumbnailPublicID = getPublicIdFromUrl(thumbnail.url)

    const course = await Course.create({
        title,
        description,
        category,
        createdBy,
        thumbnail:{
            public_id:thumbnailPublicID,
            secure_url:thumbnailUrl
        }
    })

    if(!course){
        throw new ApiError(400,'course couldnt be created successfully')
    }

    await course.save()


    return res.status(200)
    .json(new ApiResponse(200,course,"course created successfully "))

    
})


const updateCourse = asyncHandler(async(req,res)=>{
    try{
        const {id} = req.params
        const course =Course.findByIdAndUpdate(id,
            {
                $set:req.body 
            }
            ,{
                runValidators:true 
            },

            {
                new:true
            }
        )

        if(!course){
            throw new ApiError(400,'Course with given id doesnt exists')
        }

        return res.status(200)
        .json(new ApiResponse(200,course,"course updated successfully"))
    }
    catch(err){
        throw new ApiError(400,err)
    }
})

const removeCourses = asyncHandler(async(req,res)=>{
    const {id} = req.params
    const course = Course.findByIdAndDelete(id)

    if(!course){
        throw new ApiError(400,"course with given id doesnt exists")
    }

    const lectures = course.lectures

    lectures.map((item)=>deleteFromCloudinary(item.public_id))

    return res.status(200)
    .json(new ApiResponse(200,{},"course deleted successfully"))
})

const getLectureById = asyncHandler(async (req, res) => {
    const { course_id, lec_id } = req.params;

    // Find the course by its ID
    const course = await Course.findById(course_id);

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    // Find the lecture with the given lecture ID within the lectures array of the course
    const lecture = course.lectures.find(lecture => lecture._id == lec_id);

    if (!lecture) {
        throw new ApiError(404, "Lecture not found");
    }

    // Return the lecture object
    res.status(200).json(new ApiResponse(200, lecture, "Lecture retrieved successfully"));
});


const deleteLectureById = asyncHandler(async (req, res) => {
    const { course_id, lec_id } = req.params;

    // Find the course by its ID and remove the lecture with the given lecture ID
    const course = await Course.findOneAndUpdate(
        { _id: course_id },
        { $pull: { lectures: { _id: lec_id } } },
        { new: true } // Return the updated document
    );

    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    // Return the updated course object
    res.status(200).json(new ApiResponse(200, course, "Lecture deleted successfully"));
});


const addLectureToCourseById = asyncHandler(async(req,res)=>{
    const {title,description} = req.body
    const {id} = req.params

    if(!title || !description){
        throw new ApiError(400,"title and description required")

    }

    const course = await Course.findById(id)

    if(!course){
        throw new ApiError(400,"no such course exists")
    }

    const lectureLocalFile = req.files.lecture[0].path
    if(!lectureLocalFile){
        throw new ApiError(400,"Please provide lecture video")
    }

    console.log(lectureLocalFile)
    const lecture = await uploadOnCloudinary(lectureLocalFile)
    console.log(lecture)

    if(!lecture){
        throw new ApiError(400,"lecture couldnt be uploaded");
    }

    const lectureUrl = lecture.url
    console.log(lectureUrl)
    const lecturePublicId = getPublicIdFromUrl(lecture.url)

    course.lectures.push({
        title,
        description,
        lecture:{
            public_id:lecturePublicId,
            secure_url:lectureUrl
        }

    })
    course.numberOfLectures = course.lectures.length;
    await course.save({validateBeforeSave:false})

    return res.status(200)
    .json(new ApiResponse(200,course,"lecture successfully added to the course "));
})

export {getAllCourses,createCourse,addLectureToCourseById,getLecturesByCourseId,removeCourses,updateCourse,getLectureById,deleteLectureById}
