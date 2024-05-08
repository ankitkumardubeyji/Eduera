import mongoose, {model,Schema} from 'mongoose'

const courseSchema = new Schema({
    title:{
        type:String,
        required:[true,'title is required'],
        minLength:[8,'title must be 8 least characters'],
        maxLength:[50,'title can be more than 50 characters'],
        trim:true,     
    },

    description:{
        type:String,
        required:[true,'description is required'],
        minLength:[20,'description must be 20 characters long']
    },

    category:{
        type:String,
        required:[true,'category is required']
    },

    lectures:[
        {
            title:String,
            description:String,
            lecture:{
                public_id:{
                    type:String,
                    required:true, 
                },
                secure_url:{
                    type:String,
                    required:true, 
                }

            }
        }
    ],

    thumbnail:{
        public_id:{
            type:String, 
        },
        secure_url:{
            type:String, 
        }
    },

    numberOfLectures:{
        type:Number,
        default:0,
    },

    createdBy:{
        type:String,
        required:[true,'course instructor name is required']
    }
},
{
    timestamps:true
}

)

const Course = mongoose.model('Course',courseSchema)

export default Course;

