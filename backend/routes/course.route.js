import express from "express";
import {
  createCourse,
  updateCourse,
  deleteCourse,
  getCourses,
  courseDetails,
  buyCourses,
} from "../controllers/course.controller.js";

import userMiddleware from "../middlewares/user.mid.js";
import adminMiddleware from "../middlewares/admin.mid.js";

const router = express.Router();

/* ======================
   ADMIN COURSE ROUTES
====================== */

// Create a new course (Admin only)
router.post("/create", adminMiddleware, createCourse);

// Update existing course (Admin only)
router.put("/update/:courseId", adminMiddleware, updateCourse);

// Delete a course (Admin only)
router.delete("/delete/:courseId", adminMiddleware, deleteCourse);

/* ======================
   PUBLIC COURSE ROUTES
====================== */

// Get all courses
router.get("/courses", getCourses);

// Get single course details
router.get("/:courseId", courseDetails);

/* ======================
   USER COURSE ROUTES
====================== */

// Buy a course (User only)
router.post("/buy/:courseId", userMiddleware, buyCourses);

export default router;
