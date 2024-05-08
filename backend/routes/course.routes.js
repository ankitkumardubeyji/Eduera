import { Router } from "express";
import { addLectureToCourseById, createCourse, deleteLectureById, getAllCourses, getLectureById, getLecturesByCourseId, removeCourses, updateCourse } from "../src/controllers/course.controller.js";
import { upload } from "../src/middlewares/multer.middleware.js";

const router = Router()



router.route("/").get(getAllCourses)
router.route("/create").post(upload.fields([
    {
        name:"thumbnail",
        maxCount:1
    }
]),
createCourse)
router.route("/lectures/:id").get(getLecturesByCourseId)
router.route("/update/:id").patch(updateCourse)
router.route("/delete/:id").delete(removeCourses)
router.route("/add/lecture/:id").patch(upload.fields([
    {
        name:"lecture",
        maxCount:1
    }
]),addLectureToCourseById)
router.route("/access/lecture/:course_id/:lec_id").get(getLectureById)
router.route("/delete/lecture/:course_id/:lec_id").delete(deleteLectureById)

export default router;