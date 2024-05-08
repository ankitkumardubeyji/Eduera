import { Router } from "express";
import { upload } from "../src/middlewares/multer.middleware.js";
import { loginUser, registerUser } from "../src/controllers/user.controllers.js";

const router = Router()



router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxCount:1 
    }
])
,registerUser)
router.route("/login").post(loginUser)

export default router;

