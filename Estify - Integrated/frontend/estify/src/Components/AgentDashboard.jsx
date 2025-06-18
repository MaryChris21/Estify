"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import PropertyTable from "../Components/PropertyTable"
import { LogOut, Home, PlusCircle, User } from "lucide-react"
import { motion } from "framer-motion"
import BackgroundImage from "../assets/background.jpg"
import toast from "react-hot-toast"

const AgentDashboard = () => {
  const [properties, setProperties] = useState([])
  const [agentInfo, setAgentInfo] = useState(null)
  const navigate = useNavigate()

  const fetchAgentProperties = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/properties/my-properties", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("agentToken")}`,
        },
      })
      setProperties(res.data)
      toast.success("Properties fetched successfully")
    } catch (err) {
      console.error("Failed to fetch agent properties", err)
      toast.error("Failed to load properties")
    }
  }

  const fetchAgentProfile = async () => {
    try {
      const token = localStorage.getItem("agentToken")
      if (!token) return

      // Get the agent ID from the token
      const tokenData = JSON.parse(atob(token.split(".")[1]))
      const agentId = tokenData.id

      const res = await axios.get(`http://localhost:5001/api/agents/${agentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setAgentInfo(res.data)
    } catch (err) {
      console.error("Failed to fetch agent profile", err)
      toast.error("Failed to load profile information")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("agentToken")
    toast("Logged out", { icon: "👋", style: { background: "#fef3c7" } })
    navigate("/agent-login")
  }

  const handlePostAd = () => {
    toast("Redirecting to Post Ad form", { icon: "📢" })
    navigate("/postad")
  }

  const handleProfileClick = () => {
    navigate("/agent-profile")
  }

  useEffect(() => {
    const token = localStorage.getItem("agentToken")
    if (!token) {
      navigate("/agent-login")
    } else {
      fetchAgentProperties()
      fetchAgentProfile()
    }
  }, [navigate])

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {/* Background blur overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full px-4 py-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Home className="text-green-600" />
              <h1 className="text-3xl font-bold text-gray-800">Agent Dashboard</h1>
              {agentInfo && (
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Welcome, {agentInfo.name}
                </span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleProfileClick}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow"
              >
                <User size={18} /> Profile
              </button>
              <button
                onClick={handlePostAd}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl shadow"
              >
                <PlusCircle size={18} /> Post Ad
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <PropertyTable properties={properties} refresh={fetchAgentProperties} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default AgentDashboard
