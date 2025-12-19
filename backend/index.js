import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

// Routes
import courseRoute from "./routes/course.route.js";
import userRoute from "./routes/user.route.js";
import adminRoute from "./routes/admin.route.js";
import orderRoute from "./routes/order.route.js";

// Load environment variables
dotenv.config();

const app = express();

// GLOBAL MIDDLEWARES
app.use(express.json());
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


// CLOUDINARY CONFIG

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// DATABASE CONNECTION

const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// ROUTES

app.get("/", (req, res) => {
  res.send("Online Classroom backend is running successfully");
});

app.use("/api/v1/course", courseRoute);
app.get("/api/test", (req, res) => {
  res.json({ message: "API working fine 🚀" });
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/order", orderRoute);


// SERVER START

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
