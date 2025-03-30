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
<<<<<<< HEAD
  getAllAgentProperties
} from "../Controllers/PropertyController.js";

const router = express.Router();

// File upload configuration
=======
  getAllAgentProperties,
  getFilteredReport
} from "../Controllers/propertyController.js";

const router = express.Router();

>>>>>>> fa71c03728e8271397cfbd1994cb2c379e8d37e8
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

<<<<<<< HEAD
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
=======
// Agent Routes (with approval flow)
>>>>>>> fa71c03728e8271397cfbd1994cb2c379e8d37e8
router.post("/post", verifyAgent, upload.single("image"), submitPropertyRequest);
router.post("/update", verifyAgent, upload.single("image"), requestPropertyUpdate);
router.delete("/delete/:id", verifyAgent, requestPropertyDelete);
router.get("/my-properties", verifyAgent, getAgentProperties);
<<<<<<< HEAD
router.get("/all-mine", verifyAgent, getAllAgentProperties);

/**
 * Direct Property Management for Agents
 */
router.post("/direct/add", verifyAgent, upload.single("image"), createPropertyDirect);
router.put("/direct/update/:id", verifyAgent, upload.single("image"), updatePropertyDirect);
router.delete("/direct/delete/:id", verifyAgent, deletePropertyDirect);
=======

// Agent Routes (direct CRUD)
router.post("/direct/add", verifyAgent, upload.single("image"), createPropertyDirect);
router.put("/direct/update/:id", verifyAgent, upload.single("image"), updatePropertyDirect);
router.delete("/direct/delete/:id", verifyAgent, deletePropertyDirect);
router.get("/all-mine", verifyAgent, getAllAgentProperties);

// Admin Routes
router.get("/pending", getPendingRequests);
router.post("/approve/:id", approvePropertyRequest);
router.delete("/reject/:id", rejectPropertyRequest);
router.get("/report", getFilteredReport);

// Public Routes
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);
router.post("/add", upload.single("image"), submitPropertyRequest);
>>>>>>> fa71c03728e8271397cfbd1994cb2c379e8d37e8

export default router;
