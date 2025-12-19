import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET || "super_secret_key",
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
};

export default config;
