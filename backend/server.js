import dotenv from "dotenv";
import express from "express";
import connectDB from "./Database/DB.js";
import PropertyRoutes from "./Routes/PropertyRoutes.js";
import AgentRoutes from "./Routes/agentRoutes.js";
import path from "path";
import cors from "cors";

dotenv.config();
const app = express();
connectDB();

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use("/api/agents", AgentRoutes);
app.use("/api/properties", PropertyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
