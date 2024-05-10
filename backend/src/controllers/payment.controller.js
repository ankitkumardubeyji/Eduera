import {razorpay} from "../index.js"
import { Payment } from "../models/payment.models.js"
import User from "../models/user.models.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

import crypto from "crypto"

const getRazorpayKey = asyncHandler(async(req,res)=>{
    console.log("common came atleast here for getting razorpay")
    console.log(process.env.RAZORPAY_API_KEY)
    return res.status(200)
    .json(new ApiResponse(200,{
        key:process.env.RAZORPAY_API_KEY
    },'RazorPay Api Key successfully fetched '))



})

const buySubscription = asyncHandler(async(req,res)=>{
    const {_id} = req.user

    const user = await User.findById(_id)
    if(!user){
        throw new ApiError(400,"Unauthorised request please login")
    }

    if(user.role==='ADMIN'){
        throw new ApiError(400,'ADMIN cannot purchase subscription')
    }

    const subscription = await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_PLAN_ID, // The unique plan ID
        customer_notify: 1, // 1 means razorpay will handle notifying the customer, 0 means we will not notify the customer
        total_count: 12, // 12 means it will charge every month for a 1-year sub.
      });

    user.subscription.id = subscription.id 
    user.subscription.status = subscription.status

    await user.save() 

    console.log(subscription.id+" is the id")

    return res.status(200)
    .json(new ApiResponse(200,{subscription_id:subscription.id},"subscribed successfully"))


})


const verifySubscription = asyncHandler(async(req,res)=>{
    const {_id} = req.user
    const {razorpay_payment_id,razorpay_signature,razorpay_subscription_id} = req.body


    const user = await User.findById(_id)
    if(!user){
        throw new ApiError(400,"UnAuthoirsed Request")
    }

    const subscriptionId = user.subscription.id
    console.log(razorpay_payment_id+" is the razorpay oay")
    console.log(subscriptionId)


// now lets verify the payemnt has been done or not 
const generatedSignature = crypto
.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
.update(`${razorpay_payment_id}|${subscriptionId}`)
.digest('hex');


console.log(generatedSignature)
console.log(razorpay_signature)
    if(generatedSignature != razorpay_signature){
        throw new ApiError(400,'Payment not verifed try again..')
    }

    await Payment.create({
        razorpay_payment_id,
        razorpay_signature,
        razorpay_subscription_id, 
    });

    user.subscription.status =`active`;

    await user.save()
    console.log(user)
    return res.status(200).json(new ApiResponse(200,{},"Payment verified successfully"))
})

const cancelSubscription = asyncHandler(async(req,res)=>{
    const {id} = req.user._id

    const user = await User.findById(id)

    if(!user){
        throw new ApiError(400,"Unauthorised request please login")
    }

    if(user.role==='ADMIN'){
        throw new ApiError(400,'ADMIN cannot purchase subscription')
    }

    const subscriptionId = user.subscription.id 

    const subscription = await razorpay.subscriptions.cancel({
        subscriptionId  
    })

    user.subscription.status = subscription.status 

    await user.save() 

})

const allPayments = asyncHandler(async(req,res)=>{
    const {count} = req.query

    const subscriptions = await razorpay.subscriptions.all({
        count:count || 10  
    })

    return res.status(200)
    .json(new ApiResponse(200,subscriptions,"all payments fetched successfully"))



})


export {getRazorpayKey,buySubscription,verifySubscription,cancelSubscription,allPayments}














export const checkout = async(req,res)=>{
    const options = {
        amount:50000,
        currency:"INR",
    }

    const order = await instance.orders.create(options)
    console.log(order)
    
    return res.status(200)
    .json(new ApiResponse(200,{},"checked out successfully"))
}