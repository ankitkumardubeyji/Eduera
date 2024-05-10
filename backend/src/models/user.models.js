import bcrypt from "bcrypt"
import mongoose  from "mongoose";
import jwt from "jsonwebtoken"
import crypto from "crypto"


const userSchema =  mongoose.Schema({
    fullName:{
        type:String,
        required:[true,'Name is required'],
        minLength:[5, 'Name must be atleast 5 characters'],
        lowercase:true,
        trim:true, // remove unecessary spaces
    },

    email:{
        type:String,
        required:[true,"email is required"],
        unique:true,
        lowercase:true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill in a valid email address',
          ], // Matches email against regex
    },

    password:{
        type:String,
        required:[true,'password is required'],
        minLength:[8, 'password must be of atleast 8 characters'],
        select:false, // will not give password of the user unless explicitly asked 
    },

    subscription:{
        id:String,
        status:String, 
    },

    

    avatar:{
        public_id:{
            type:String, 
        },

        secure_url:{
            type:String, 
        }

    },

    role:{
        type:String,
        enum:['USER','ADMIN'],
        default:`USER`
    },
    forgotPasswordToken : String,
    forgotPasswordExpiry:Date, 
    subscription:{
        id:String,
        status:String 
    }

},{timestamps:true})

// middleware for hashing the password before saving to the database


userSchema.pre("save",async function(next){ // dont write arrow function here else you wont be able to have context of this
    if(!this.isModified("password")){
        return next ();
    }
    console.log("here"+this.password)
    this.password = await bcrypt.hash(this.password,10)
})

// defining the custom methods related to users
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password,this.password) 
}


userSchema.methods.generateJWTToken = async function(){
    return await jwt.sign(
        {_id:this._id, role:this.role,subscription:this.subscription, email:this.email}, // payload data
        process.env.JWT_SECRET,
        {
            expiresIn:process.env.JWT_EXPIRY
        }
    )
}

// custom method for generating the reset password token
userSchema.methods.generatePasswordResetToken = async function(){
    
  // creating a random token using nodes built in crypto module  
    const resetToken = crypto.randomBytes(20).toString('hex');


  // again using the crypto module to hash the generated resetToken
  this.forgotPasswordToken = crypto
  .createHash('sha256') // sha256 is the algorithm using which hash has been generated
  .update(resetToken)
  .digest('hex') // producing the digets in hexadecimal format
  
  // adding forget password expiry to 15 minutes
  this.forgotPasswordExpiry = Date.now() + 15*60*1000;

  return resetToken;
}

const User = mongoose.model('User',userSchema)

export default User;


