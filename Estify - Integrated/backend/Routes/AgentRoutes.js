import express from "express"
import {
  loginAgent,
  registerAgent,
  getAgentById,
  getAllAgents,
  updateAgent,
  deleteAgent,
} from "../Database/Controllers/AgentController.js"
import { verifyAgent } from "../middleware/verifyAgent.js"

const router = express.Router()

router.post("/register", registerAgent)
router.post("/login", loginAgent)
router.get("/:id", getAgentById)
router.get("/", getAllAgents)

// Protected routes that require authentication
router.put("/:id", verifyAgent, updateAgent)
router.delete("/:id", verifyAgent, deleteAgent)

export default router
