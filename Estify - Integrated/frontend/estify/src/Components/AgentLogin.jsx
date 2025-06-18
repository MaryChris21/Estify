"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import BackgroundImage from "../assets/background.jpg"
import { ArrowLeft } from "lucide-react" // ← Add icon
import toast from "react-hot-toast"

const AgentLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post("http://localhost:5001/api/agents/login", form)
      localStorage.setItem("agentToken", res.data.token)
      toast.success("Login successful!")
      navigate("/agent-dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.")
    }
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      <div className="relative z-10 max-w-md w-full">
        {/* Home link */}
        <button onClick={() => navigate("/homepage")} className="flex items-center text-green-700 mb-4 hover:underline">
          <ArrowLeft size={18} className="mr-1" />
          Home
        </button>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4 text-center">Agent Login</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="border p-2 w-full rounded"
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AgentLogin
