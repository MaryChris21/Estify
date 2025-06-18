import Agent from "../../Models/AgentModel.js"
import { generateToken } from "../../utils/jwt.js"
import bcrypt from "bcrypt"

export const registerAgent = async (req, res) => {
  const { name, email, password, phone, agencyName } = req.body
  try {
    const existing = await Agent.findOne({ email })
    if (existing) return res.status(400).json({ message: "Email already in use" })

    const agent = new Agent({ name, email, password, phone, agencyName })
    await agent.save()

    const token = generateToken(agent._id, "agent")
    res.status(201).json({ message: "Agent registered successfully", token, agent })
  } catch (err) {
    res.status(500).json({ message: "Agent registration failed", error: err.message })
  }
}

export const loginAgent = async (req, res) => {
  const { email, password } = req.body

  try {
    const agent = await Agent.findOne({ email })
    if (!agent) return res.status(401).json({ message: "Invalid credentials" })

    const match = await agent.comparePassword(password)
    if (!match) return res.status(401).json({ message: "Invalid credentials" })

    const token = generateToken(agent._id, "agent")
    res.status(200).json({ message: "Login successful", token, agent })
  } catch (err) {
    res.status(500).json({ message: "Agent login failed", error: err.message })
  }
}

export const getAgentById = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select("-password")
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" })
    }
    res.status(200).json(agent)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch agent", error: err.message })
  }
}

export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select("_id email name")
    res.status(200).json(agents)
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch agents", error: err.message })
  }
}

export const updateAgent = async (req, res) => {
  try {
    const { name, email, phone, agencyName, currentPassword, newPassword } = req.body
    const agentId = req.params.id

    // Verify that the agent exists
    const agent = await Agent.findById(agentId)
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" })
    }

    // Check if the agent is trying to update their password
    if (newPassword) {
      // Verify current password
      const isMatch = await agent.comparePassword(currentPassword)
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" })
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)
      agent.password = hashedPassword
    }

    // Update other fields
    agent.name = name || agent.name
    agent.email = email || agent.email
    agent.phone = phone || agent.phone
    agent.agencyName = agencyName || agent.agencyName

    await agent.save()

    // Return the updated agent without the password
    const updatedAgent = await Agent.findById(agentId).select("-password")
    res.status(200).json(updatedAgent)
  } catch (err) {
    res.status(500).json({ message: "Failed to update agent", error: err.message })
  }
}

export const deleteAgent = async (req, res) => {
  try {
    const agentId = req.params.id
    const agent = await Agent.findByIdAndDelete(agentId)

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" })
    }

    res.status(200).json({ message: "Agent account deleted successfully" })
  } catch (err) {
    res.status(500).json({ message: "Failed to delete agent", error: err.message })
  }
}
