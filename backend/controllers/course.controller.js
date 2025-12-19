import { Course } from "../models/course.model.js";
import { Purchase } from "../models/purchase.model.js";
import { v2 as cloudinary } from "cloudinary";
import Stripe from "stripe";
import config from "../config.js";

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

/* ======================
   CREATE COURSE (ADMIN)
====================== */
export const createCourse = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price } = req.body;

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    if (!req.files || !req.files.image) {
      return res.status(400).json({ errors: "Course image is required" });
    }

    const image = req.files.image;
    const allowedFormats = ["image/png", "image/jpeg"];

    if (!allowedFormats.includes(image.mimetype)) {
      return res
        .status(400)
        .json({ errors: "Only PNG and JPG images are allowed" });
    }

    const uploadResponse = await cloudinary.uploader.upload(
      image.tempFilePath
    );

    const course = await Course.create({
      title,
      description,
      price,
      image: {
        public_id: uploadResponse.public_id,
        url: uploadResponse.secure_url,
      },
      creatorId: adminId,
      createdBy: "Priyanshu Sagar",
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create course error:", error);
    res.status(500).json({ errors: "Error creating course" });
  }
};

/* ======================
   UPDATE COURSE (ADMIN)
====================== */
export const updateCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;
  const { title, description, price, image } = req.body;

  try {
    const course = await Course.findOneAndUpdate(
      { _id: courseId, creatorId: adminId },
      { title, description, price, image },
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        errors: "Course not found or you are not the creator",
      });
    }

    res.status(200).json({
      message: "Course updated successfully",
      course,
    });
  } catch (error) {
    console.error("Update course error:", error);
    res.status(500).json({ errors: "Error updating course" });
  }
};

/* ======================
   DELETE COURSE (ADMIN)
====================== */
export const deleteCourse = async (req, res) => {
  const adminId = req.adminId;
  const { courseId } = req.params;

  try {
    const course = await Course.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });

    if (!course) {
      return res.status(404).json({
        errors: "Course not found or you are not the creator",
      });
    }

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Delete course error:", error);
    res.status(500).json({ errors: "Error deleting course" });
  }
};

/* ======================
   GET ALL COURSES (PUBLIC)
====================== */
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.status(200).json({ courses });
  } catch (error) {
    console.error("Get courses error:", error);
    res.status(500).json({ errors: "Error fetching courses" });
  }
};

/* ======================
   COURSE DETAILS (PUBLIC)
====================== */
export const courseDetails = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }
    res.status(200).json({ course });
  } catch (error) {
    console.error("Course details error:", error);
    res.status(500).json({ errors: "Error fetching course details" });
  }
};

/* ======================
   BUY COURSE (USER)
====================== */
export const buyCourses = async (req, res) => {
  const { userId } = req;
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ errors: "Course not found" });
    }

    const alreadyPurchased = await Purchase.findOne({ userId, courseId });
    if (alreadyPurchased) {
      return res.status(400).json({
        errors: "You have already purchased this course",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: course.price * 100, // Stripe uses cents
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(201).json({
      message: "Payment initiated successfully",
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Buy course error:", error);
    res.status(500).json({ errors: "Payment failed" });
  }
};
