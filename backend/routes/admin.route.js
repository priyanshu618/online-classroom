import express from "express";
import {
  signup,
  login,
  logout,
} from "../controllers/admin.controller.js";

const router = express.Router();

/* ======================
   ADMIN AUTH ROUTES
====================== */

// Create a new admin account
router.post("/signup", signup);

// Admin login
router.post("/login", login);

// Admin logout
router.get("/logout", logout);

export default router;
