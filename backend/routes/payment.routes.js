import { Router } from "express";
import { authorisedRoles, verifyJWT } from "../src/middlewares/auth.middleware.js";
import { allPayments, buySubscription, cancelSubscription, getRazorpayKey, verifySubscription } from "../src/controllers/payment.controller.js";

const router = Router()


router.use(verifyJWT)

router.route("/razorpay-key").get(getRazorpayKey)
router.route("/subscribe").post(buySubscription)
router.route("/verify").post(verifySubscription)
router.post("/unsubscribe").post(cancelSubscription)
router.post("/").get(authorisedRoles('ADMIN'),allPayments)



export default router