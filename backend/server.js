import dotenv from "dotenv";
import express from "express";
<<<<<<< HEAD
import mongoose from "mongoose";
=======
import connectDB from "./Database/DB.js";
import PropertyRoutes from "./Routes/PropertyRoutes.js";
import AgentRoutes from "./Routes/agentRoutes.js";
>>>>>>> fa71c03728e8271397cfbd1994cb2c379e8d37e8
import path from "path";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./Middleware/errorHandler.js"; 

import connectDB from "./Database/DB.js"; // Unified DB Connection
import PropertyRoutes from "./Routes/PropertyRoutes.js";
import AgentRoutes from "./Routes/agentRoutes.js";
import BookingRoutes from "./Routes/BookingRoutes.js";
import AuthRoutes from "./Routes/AuthRoutes.js";
import AdminRoutes from "./Routes/AdminRoutes.js";
import InquiryRoutes from "./Routes/InquiryRoutes.js";

dotenv.config();
const app = express();

// Connect to Database
connectDB();

<<<<<<< HEAD
// Middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
=======
app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
>>>>>>> fa71c03728e8271397cfbd1994cb2c379e8d37e8

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// Logging (Only in Development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/agents", AgentRoutes);
app.use("/api/properties", PropertyRoutes);
app.use("/api/bookings", BookingRoutes);
app.use("/api/auth", AuthRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/inquiries", InquiryRoutes);
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
<<<<<<< HEAD
=======
app.use("/api/agents", AgentRoutes);
app.use("/api/properties", PropertyRoutes);
>>>>>>> fa71c03728e8271397cfbd1994cb2c379e8d37e8

// Health Check
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});
