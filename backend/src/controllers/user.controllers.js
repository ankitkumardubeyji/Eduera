import User from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getPublicIdFromUrl, uploadOnCloudinary } from "../utils/cloudinary.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto"


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

    const accessToken = await user.generateJWTToken(user._id)

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

/*
The idea of the forget and reset password is as follow 
- when the request for the forgot password comes 
- first verify the email if the given email exists in db
- Then create resetToken , hash the resetToken and stored as forgotExpiryToken in db , store the forgotPassword Expiry in dband return original 
 resetToken
- Send the resetToken as the mail, now the process for the reset password starts
- when the user clicks on the sent link , the resetToken coming from the params is verified , and password updated successfully 
*/


const forgotPassword = asyncHandler(async(req,res,next)=>{
  const {email} = req.body

  if(!email){
    throw new ApiError(400,"email is required")
  }

  const user = await User.findOne({email})

  if(!user){
    throw new ApiError(400,"User with given email doesnt exists")
  }
  console.log(user)
  // generating the reset password token
  const resetToken = await user.generatePasswordResetToken(); // the function generates the forgotpassword token hash using crypyt stores in db and returns the resetPassword

  await user.save(); // saving the forgot password to db.

  const resetPasswordUrl = `localhost:5456/reset-password/${resetToken}`;

  const subject = `Reset Password`
  const message = `You can reset your password by clicking <a href="http://${resetPasswordUrl}" target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;

  try{
    await sendEmail(email,subject,message);

    res.status(200)
    .json(new ApiResponse(200,{},`Reset password sent successfully to ${email}.`))
  }

  catch(err){
    // if we are not able to send email then we are clearing the forgetpaswordtoken and forgetpasswordexpiry token stored in db.
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save()

    throw new ApiError(400,err);
  }
    

});


 const resetPassword = asyncHandler(async(req,res,next)=>{
    const {resetToken} = req.params

    // extracting password
    const {password} = req.body

    // generating the forgotpassword token with the reset password , to compare that with stored in db
    const forgotPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');


    if(!password){
        return new ApiError(400,"password is required")
    }

    // checking if the token matches in db and still valid

    const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry:{$gt:Date.now()}  // check if the time for the token stored in the db has not expired now and it matches with the incoming token
    })

    if(!user){
        throw new ApiError(400,"token is invalid")
    }

    user.password = password
    user.forgotPasswordExpiry = undefined
    user.forgotPasswordToken = undefined

    await user.save()

    res.status(200)
    .json(new ApiResponse(200,{},"Password Reset successfully!"))
})





export {registerUser,loginUser,logout,forgotPassword,resetPassword}