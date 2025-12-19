import express from "express";
import { orderData } from "../controllers/order.controller.js";
import userMiddleware from "../middlewares/user.mid.js";

const router = express.Router();

/* ======================
   ORDER ROUTES
====================== */

// Place an order (User only)
router.post("/", userMiddleware, orderData);

export default router;
