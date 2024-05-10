import express from "express"
import cookieparser from "cookie-parser"
import cors from "cors"


const app = express();
app.use(cookieparser())
app.use(cors())
app.use(express.json({limit:"16kb"}))
app.use(express.static("public"))


import userRouter from "../routes/user.routes.js"
import courseRouter from "../routes/course.routes.js"
import paymentRouter from "../routes/payment.routes.js"

app.use("/api/v1/users",userRouter)
app.use("/api/v1/courses/",courseRouter)
app.use("/api/v1/payments",paymentRouter)

export default app;