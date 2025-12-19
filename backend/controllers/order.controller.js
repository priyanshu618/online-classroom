import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";

/* ======================
   CREATE ORDER (USER)
====================== */
export const orderData = async (req, res) => {
  try {
    const orderPayload = req.body;

    // Basic validation
    if (!orderPayload || !orderPayload.userId || !orderPayload.courseId) {
      return res.status(400).json({
        errors: "User ID and Course ID are required to place an order",
      });
    }

    // Create order
    const orderInfo = await Order.create(orderPayload);

    // Create purchase record after successful order
    await Purchase.create({
      userId: orderInfo.userId,
      courseId: orderInfo.courseId,
      purchasedBy: "Priyanshu Sagar",
    });

    res.status(201).json({
      message: "Order placed successfully",
      order: orderInfo,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      errors: "Error while creating order",
    });
  }
};
