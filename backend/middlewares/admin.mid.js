import jwt from "jsonwebtoken";
import config from "../config.js";

function adminMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // Check if token exists
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.JWT_ADMIN_PASSWORD);

    // attach admin id to request
    req.adminId = decoded.id;

    next();
  } catch (error) {
    console.log("Error in admin middleware:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

export default adminMiddleware;
