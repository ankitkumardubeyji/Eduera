// here we are uploading the file from the localstorage server to cloudinary and then removing from the local server

import {v2 as cloudinary} from "cloudinary"
import { error } from "console"
import fs from "fs"

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET 
})

export const uploadOnCloudinary = async(localFilePath)=>{
    try{
        if(!localFilePath){
            return null 
        }

        // upload the file on cloudinary
      
       const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type:"auto"
    })

 


       fs.unlinkSync(localFilePath ) // remove the temporarily saved local file 
       return response;
    }

    catch(err){
        fs.unlinkSync(localFilePath) 
        console.log(error)
        
    }
}

// function for extracting the public id from the url
export function getPublicIdFromUrl(cloudinaryUrl) {
    // Cloudinary URL format: https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/<public_id>.<format>
    const parts = cloudinaryUrl.split('/');
    const publicIdWithFormat = parts[parts.length - 1]; // Get the last part of the URL
    const publicId = publicIdWithFormat.split('.')[0]; // Remove the format extension
    return publicId;
}

// function for deleting the file from the cloudinary
export const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) {
            return null;
        }

        // Delete the file from Cloudinary
        const response = await cloudinary.uploader.destroy(publicId);

        return response; // Return the response from Cloudinary
    } catch (err) {
        // Handle errors
        console.error("Error deleting file from Cloudinary:", err);
        throw err;
    }
};

