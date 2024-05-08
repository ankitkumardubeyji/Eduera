import { Router } from "express";
import { upload } from "../src/middlewares/multer.middleware.js";
import { forgotPassword, loginUser, logout, registerUser, resetPassword } from "../src/controllers/user.controllers.js";

const router = Router()



router.route("/register").post(upload.fields([
    {
        name:"avatar",
        maxCount:1 
    }
])
,registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logout)
router.post("/reset", forgotPassword);
router.post("/reset/:resetToken", resetPassword);

export default router;

