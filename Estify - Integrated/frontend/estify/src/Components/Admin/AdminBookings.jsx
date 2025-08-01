"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { usePDF } from "react-to-pdf"
import { FiMessageSquare, FiMail, FiDownload, FiLogOut } from "react-icons/fi"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const AdminBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const { toPDF, targetRef } = usePDF({ filename: "bookings-report.pdf" })

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("Please log in to access this page.")
          setTimeout(() => navigate("/login"), 2000)
          return
        }

        const response = await axios.get("http://localhost:5001/api/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` },
          params: { status: statusFilter },
        })

        const validBookings = Array.isArray(response.data?.bookings)
          ? response.data.bookings.filter((booking) => booking && booking.property)
          : []
        setBookings(validBookings)
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          (err.response?.status === 403 ? "Access denied. Admin role required." : "Failed to fetch bookings")
        setError(errorMessage)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [navigate, statusFilter])

  const handleConfirmBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `http://localhost:5001/api/admin/bookings/${bookingId}/confirm`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setBookings(bookings.map((b) => (b._id === bookingId ? response.data.booking : b)))
      toast.success("Booking confirmed successfully!")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to confirm booking")
    }
  }

  const handleRejectBooking = async (bookingId) => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `http://localhost:5001/api/admin/bookings/${bookingId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      setBookings(bookings.map((b) => (b._id === bookingId ? response.data.booking : b)))
      toast.success("Booking rejected successfully!")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reject booking")
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Invalid Date"
    }
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-green-100 text-green-800 border-green-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
    }
    const defaultClass = "bg-gray-100 text-gray-800 border-gray-200"
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${statusClasses[status] || defaultClass}`}>
        {status ? status.toUpperCase() : "UNKNOWN"}
      </span>
    )
  }

  const shareOnWhatsApp = (booking) => {
    try {
      const propertyTitle = booking.property?.title || "Unknown Property"
      const userName = booking.user?.username || "Unknown User"
      const dates = `${formatDate(booking.startDate)} to ${formatDate(booking.endDate)}`
      const totalPrice = calculateTotalPrice(booking)
      const status = booking.status ? booking.status.toUpperCase() : "UNKNOWN"

      const message =
        `📅 *Booking Details*\n\n` +
        `🏠 *Property:* ${propertyTitle}\n` +
        `👤 *Guest:* ${userName}\n` +
        `📆 *Dates:* ${dates}\n` +
        `💰 *Total:* ${totalPrice}\n` +
        `📌 *Status:* ${status}\n\n` +
        `_Shared via Admin Dashboard_`

      const encodedMessage = encodeURIComponent(message)
      window.open(`https://wa.me/?text=${encodedMessage}`, "_blank")
      toast.info("Opening WhatsApp to share booking details...")
    } catch (err) {
      toast.error("Failed to share on WhatsApp")
    }
  }

  const shareViaEmail = (booking) => {
    try {
      const propertyTitle = booking.property?.title || "Unknown Property"
      const userName = booking.user?.username || "Unknown User"
      const dates = `${formatDate(booking.startDate)} to ${formatDate(booking.endDate)}`
      const totalPrice = calculateTotalPrice(booking)
      const status = booking.status ? booking.status.toUpperCase() : "UNKNOWN"

      const subject = `Booking Details: ${propertyTitle}`
      const body =
        `Booking Details:\n\n` +
        `Property: ${propertyTitle}\n` +
        `Guest: ${userName}\n` +
        `Dates: ${dates}\n` +
        `Total: ${totalPrice}\n` +
        `Status: ${status}\n\n` +
        `View more details: ${window.location.origin}/admin/bookings/${booking._id}`

      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    } catch (err) {
      toast.error("Failed to open email client")
    }
  }

  const calculateTotalPrice = (booking) => {
    try {
      if (!booking?.price || !booking?.startDate || !booking?.endDate) return "N/A"

      const start = new Date(booking.startDate)
      const end = new Date(booking.endDate)
      const days = Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)))
      return `Rs.${(booking.price * days).toFixed(2)}`
    } catch {
      return "N/A"
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      booking.user?.username?.toLowerCase().includes(searchLower) ||
      booking.property?.title?.toLowerCase().includes(searchLower) ||
      booking.property?.district?.toLowerCase().includes(searchLower)
    )
  })

  const renderActions = (booking) => {
    if (!booking?._id) return null

    return (
      <div className="flex space-x-2 justify-end">
        {booking.status === "pending" && (
          <>
            <button
              onClick={() => handleConfirmBooking(booking._id)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700"
            >
              Confirm
            </button>
            <button
              onClick={() => handleRejectBooking(booking._id)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              Reject
            </button>
          </>
        )}
        <button
          onClick={() => shareOnWhatsApp(booking)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-500 hover:bg-green-600"
          title="Share via WhatsApp"
        >
          <FiMessageSquare className="mr-1" />
        </button>
        <button
          onClick={() => shareViaEmail(booking)}
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-500 hover:bg-blue-600"
          title="Share via Email"
        >
          <FiMail className="mr-1" />
        </button>
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-lg font-medium text-gray-700">Loading bookings...</p>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow transition duration-200"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation Bar */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigate("/admin/bookings")}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Dashboard
          </button>
          <button
            onClick={() => navigate("/admin/analytics")}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            Analytics
          </button>
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Properties
          </button>
          <button
            onClick={() => navigate("/admin/inquiries")}
            className="flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Inquiries
          </button>
          <button
            onClick={() => navigate("/reports")}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2a2 2 0 012-2h2a2 2 0 012 2v2m-6 4h6m-3-14v6m-7 2a9 9 0 1118 0 9 9 0 01-18 0z"
              />
            </svg>
            Reports
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition duration-200 ml-auto"
          >
            <FiLogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 p-6" ref={targetRef}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Booking Management</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => toPDF()}
              className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition duration-200"
            >
              <FiDownload className="mr-2" />
              Export to PDF
            </button>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {filteredBookings.length} {filteredBookings.length === 1 ? "Booking" : "Bookings"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label htmlFor="searchQuery" className="block text-sm font-medium text-gray-700 mb-1">
              Search Bookings
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="searchQuery"
                type="text"
                placeholder="Search by user or property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {bookings.length === 0
                ? "There are no bookings in the system yet."
                : "No bookings match your current filters."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setStatusFilter("")
                  setSearchQuery("")
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Property
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    User
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Dates
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Total Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
  <div className="text-sm font-medium text-gray-900">
    {booking.property?.title || "Unknown Property"}
  </div>
  <div className="text-sm text-gray-500">{booking.property?.district || "N/A"}</div>
</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.startDate && booking.endDate
                          ? `${Math.round((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24))} nights`
                          : "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{calculateTotalPrice(booking)}</div>
                      {booking.price && (
                        <div className="text-xs text-gray-500">Rs.{booking.price.toFixed(2)} per night</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(booking.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {renderActions(booking)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminBookings
