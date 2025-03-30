import express from "express";
import multer from "multer";
import { verifyAgent } from "../middleware/verifyAgent.js";
import {
  submitPropertyRequest,
  approvePropertyRequest,
  getAllProperties,
  getPropertyById,
  requestPropertyUpdate,
  requestPropertyDelete,
  getPendingRequests,
  rejectPropertyRequest,
  getAgentProperties,
  createPropertyDirect,
  updatePropertyDirect,
  deletePropertyDirect,
  getAllAgentProperties
} from "../Controllers/PropertyController.js";

const router = express.Router();

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

/** 
 * Public Routes 
 */
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.get("/pending", getPendingRequests);
router.post("/approve/:id", approvePropertyRequest);
router.delete("/reject/:id", rejectPropertyRequest);

/** 
 * Routes for Agents (with verification)
 */
router.post("/post", verifyAgent, upload.single("image"), submitPropertyRequest);
router.post("/update", verifyAgent, upload.single("image"), requestPropertyUpdate);
router.delete("/delete/:id", verifyAgent, requestPropertyDelete);
router.get("/my-properties", verifyAgent, getAgentProperties);
router.get("/all-mine", verifyAgent, getAllAgentProperties);

/**
 * Direct Property Management for Agents
 */
router.post("/direct/add", verifyAgent, upload.single("image"), createPropertyDirect);
router.put("/direct/update/:id", verifyAgent, upload.single("image"), updatePropertyDirect);
router.delete("/direct/delete/:id", verifyAgent, deletePropertyDirect);

export default router;
