import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPublicIdFromUrl, uploadOnCloudinary } from "../utils/cloudinary.js";



const registerUser = asyncHandler(async(req,res)=>{
    const {fullName, email,password } = req.body;

    if(!fullName || !email || !password){
        throw new ApiError(400,"All credentails are required!")
    }

    // now check if already a user with the given email exist then rject the request
    const existedUser = await User.findOne({email})
   

    if(existedUser){
        throw new ApiError(400,"User with the given email already exists!")
    }

    // extracting the avatar localfile that will have been stored in the localstorage 
    const avatarLocalPath = req.files.avatar[0]?.path // avatar is array of object from which path has to be extracted
    if(!avatarLocalPath){
        throw new ApiError(400,"avatar file is required");
    }
    console.log(avatarLocalPath)
    // uploading the files on the cloudinary and extracting the url and the public id
    const avatar = await uploadOnCloudinary(avatarLocalPath)
  

    if(!avatar){
        throw new ApiError(400,"avatar couldnt be uploaded");
    }

    const avatarUrl = avatar.url 
    const avatarPublicId = getPublicIdFromUrl(avatar.url)

    // creating the user with the above details
    const user = await User.create({
        fullName,
        email,
        password,
        avatar:{secure_url:avatarUrl, public_id:avatarPublicId},
    })

    const createdUser = await User.findById(user._id)

    if(!createdUser){
        throw new ApiError(500,"something went wrong while registering the user")
    }

    const accessToken = await createdUser.generateJWTToken(createdUser._id)

    return res.status(200)
    .cookie("accessToken",accessToken)
    .json(new ApiResponse(200,{
        user:createdUser,
        accessToken
    },"user registered successfully"))
    

})



const loginUser = asyncHandler(async(req,res)=>{
    const {email,password} = req.body
    if(!email|| ! password){
        throw new ApiError(400,"all credentials are required")
    }

    const user = await User.findOne({email}).select('+password')
    console.log(user)

    if(!user){
        throw new ApiError(400,"user with the given email id doent exists")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if(!isPasswordCorrect){
        throw new ApiError(400,"invalid password")
    }

    const accessToken = user.generateJWTToken(user._id)

    return res.status(200)
    .cookie("accessToken",accessToken)
    .json(new ApiResponse(200,{
        user,
        accessToken
    }, "user logged in successfully"))
})

// for logging out we just need to clear the access token
const logout = asyncHandler(async(req,res)=>{
    return res.status(200)
    .clearCookie("accessToken")
    .json(new ApiResponse(200,{},"user logged out successfully"))
})


export {registerUser,loginUser,logout}