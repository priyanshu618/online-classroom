import express from "express";
import {
  signup,
  login,
  logout,
  purchases,
} from "../controllers/user.controller.js";
import userMiddleware from "../middlewares/user.mid.js";

const router = express.Router();

/* ======================
   USER AUTH ROUTES
====================== */

// User signup
router.post("/signup", signup);

// User login
router.post("/login", login);

// User logout
router.get("/logout", logout);

/* ======================
   USER DATA ROUTES
====================== */

// Get purchased courses (Protected)
router.get("/purchases", userMiddleware, purchases);

export default router;
