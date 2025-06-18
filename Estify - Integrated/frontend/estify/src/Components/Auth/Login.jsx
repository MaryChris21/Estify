"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { jwtDecode } from "jwt-decode"
import BackgroundImage from "../../assets/background.jpg" // ✅ Add background
import toast from "react-hot-toast"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError("")
    try {
      const { data } = await axios.post("http://localhost:5001/api/auth/login", {
        email,
        password,
      })
      localStorage.setItem("token", data.token)
      const decoded = jwtDecode(data.token)
      console.log("Decoded Token (Frontend):", decoded)
      toast.success("Login successful!")
      if (decoded.role === "admin") {
        navigate("/admin/bookings")
      } else {
        navigate("/properties")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      toast.error(err.response?.data?.message || "Login failed")
    }
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      {/* Add back arrow button */}
      <button
        onClick={() => navigate("/homepage")}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-md transition duration-300 transform hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        <span className="font-medium">Home</span>
      </button>

      <div className="relative z-10 w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>

        {error && <p className="text-red-600 bg-red-100 text-center py-2 rounded-lg">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold text-lg hover:bg-green-700 transition duration-300 transform hover:scale-105 shadow-md"
          >
            Login
          </button>
        </form>

        <div className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href="/register" className="text-blue-500 font-semibold hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
