import express from "express";
<<<<<<< HEAD
import { loginAgent, registerAgent, getAgentById } from "../Controllers/AgentController.js";
=======
import {
  loginAgent,
  registerAgent,
  getAgentById,
  getAllAgents
} from "../Controllers/AgentController.js";
>>>>>>> fa71c03728e8271397cfbd1994cb2c379e8d37e8

const router = express.Router();

router.post("/register", registerAgent);
router.post("/login", loginAgent);
router.get("/:id", getAgentById);
<<<<<<< HEAD
=======
router.get("/", getAllAgents); // ✅ Added route to fetch all agents
>>>>>>> fa71c03728e8271397cfbd1994cb2c379e8d37e8

export default router;
