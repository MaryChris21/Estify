import express from "express";
import { loginAgent, registerAgent, getAgentById } from "../Controllers/AgentController.js";

const router = express.Router();

router.post("/register", registerAgent);
router.post("/login", loginAgent);
router.get("/:id", getAgentById);

export default router;
