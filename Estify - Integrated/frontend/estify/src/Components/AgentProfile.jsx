"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { User, Mail, Phone, Building, Save, Trash2, ArrowLeft } from "lucide-react"
import BackgroundImage from "../assets/background.jpg"
import toast from "react-hot-toast"

const AgentProfile = () => {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    agencyName: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAgentProfile = async () => {
      try {
        const token = localStorage.getItem("agentToken")
        if (!token) {
          navigate("/agent-login")
          return
        }

        // Get the agent ID from the token
        const tokenData = JSON.parse(atob(token.split(".")[1]))
        const agentId = tokenData.id

        const res = await axios.get(`http://localhost:5001/api/agents/${agentId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setProfile(res.data)
        setFormData({
          name: res.data.name || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          agencyName: res.data.agencyName || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch agent profile", err)
        setError("Failed to load profile information")
        setLoading(false)
      }
    }

    fetchAgentProfile()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate passwords if the user is trying to change them
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error("Current password is required to set a new password")
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords don't match")
        return
      }

      if (formData.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters")
        return
      }
    }

    try {
      const token = localStorage.getItem("agentToken")
      const tokenData = JSON.parse(atob(token.split(".")[1]))
      const agentId = tokenData.id

      // Prepare update data
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        agencyName: formData.agencyName,
      }

      // Add password fields if the user is changing password
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      await axios.put(`http://localhost:5001/api/agents/${agentId}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      toast.success("Profile updated successfully")
      setIsEditing(false)

      // Refresh profile data
      const res = await axios.get(`http://localhost:5001/api/agents/${agentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setProfile(res.data)
    } catch (err) {
      console.error("Failed to update profile", err)
      toast.error(err.response?.data?.message || "Failed to update profile")
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem("agentToken")
      const tokenData = JSON.parse(atob(token.split(".")[1]))
      const agentId = tokenData.id

      await axios.delete(`http://localhost:5001/api/agents/${agentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      localStorage.removeItem("agentToken")
      toast.success("Account deleted successfully")
      navigate("/agent-login")
    } catch (err) {
      console.error("Failed to delete account", err)
      toast.error(err.response?.data?.message || "Failed to delete account")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-700">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => navigate("/agent-dashboard")}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative flex items-center justify-center py-12 px-4"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {/* Background blur overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      <div className="relative z-10 max-w-3xl w-full">
        <button
          onClick={() => navigate("/agent-dashboard")}
          className="flex items-center text-green-700 mb-6 hover:underline"
        >
          <ArrowLeft size={18} className="mr-1" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-400 p-6 text-white">
            <h1 className="text-2xl font-bold">Agent Profile</h1>
            <p className="opacity-80">Manage your account information</p>
          </div>

          <div className="p-6">
            {!isEditing ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-3 rounded-full">
                    <User className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{profile.name}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Mail className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Phone className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{profile.phone}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Building className="text-green-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Agency Name</p>
                    <p className="font-medium">{profile.agencyName}</p>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg shadow"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Agency Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="text-gray-400" size={18} />
                    </div>
                    <input
                      type="text"
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleChange}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password (Optional)</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg shadow"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg shadow flex items-center"
                  >
                    <Save size={18} className="mr-2" /> Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-red-600 mb-4">Delete Account</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete your account? This action cannot be undone and all your data will be
              permanently removed.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center"
              >
                <Trash2 size={18} className="mr-2" /> Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AgentProfile
