import { Router } from "express";
import { upload } from "../src/middlewares/multer.middleware.js";
import { forgotPassword, getCurrentUser, loginUser, logout, registerUser, resetPassword } from "../src/controllers/user.controllers.js";
import { verifyJWT } from "../src/middlewares/auth.middleware.js";
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
router.route("/current").get(verifyJWT,getCurrentUser)

export default router;

