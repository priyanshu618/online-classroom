import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import config from "../config.js";
import { User } from "../models/user.model.js";
import { Purchase } from "../models/purchase.model.js";
import { Course } from "../models/course.model.js";

/* ======================
   USER SIGNUP
====================== */
export const signup = async (req, res) => {
  const userSchema = z.object({
    firstName: z.string().min(3, "First name must be at least 3 characters"),
    lastName: z.string().min(3, "Last name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      errors: parsed.error.issues.map((err) => err.message),
    });
  }

  const { firstName, lastName, email, password } = parsed.data;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errors: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdBy: "Priyanshu Sagar",
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("User signup error:", error);
    res.status(500).json({ errors: "Error during user signup" });
  }
};

/* ======================
   USER LOGIN
====================== */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ errors: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: "user" },
      config.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("User login error:", error);
    res.status(500).json({ errors: "Error during user login" });
  }
};

/* ======================
   USER LOGOUT
====================== */
export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("User logout error:", error);
    res.status(500).json({ errors: "Error during logout" });
  }
};

/* ======================
   USER PURCHASES
====================== */
export const purchases = async (req, res) => {
  const userId = req.userId;

  try {
    const purchasedRecords = await Purchase.find({ userId });

    const purchasedCourseIds = purchasedRecords.map(
      (purchase) => purchase.courseId
    );

    const courses = await Course.find({
      _id: { $in: purchasedCourseIds },
    });

    res.status(200).json({
      message: "Purchased courses fetched successfully",
      courses,
    });
  } catch (error) {
    console.error("User purchases error:", error);
    res.status(500).json({ errors: "Error fetching purchases" });
  }
};
