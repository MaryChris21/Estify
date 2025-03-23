import dotenv from "dotenv";
import express from "express";
import connectDB from "./Database/DB.js";
import propertyRoutes from "./Routes/propertyRoute.js";
import path from "path";
import cors from "cors";

dotenv.config();
const app = express();
connectDB();

// ✅ CORS config to allow frontend (adjust origin as needed)
app.use(cors({
  origin: "http://localhost:5173", // or your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use("/api/properties", propertyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
