import React, { useEffect, useState } from "react";
import axios from "axios";
import { DISTRICTS } from "../constants/districts";

const AdminDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [filterType, setFilterType] = useState("all");

  const fetchPending = async () => {
    const res = await axios.get("http://localhost:5001/api/properties/pending");
    const requestsWithOriginals = await Promise.all(
      res.data.map(async (req) => {
        if (req.requestType === "update" && req.originalPropertyId) {
          try {
            const original = await axios.get(
              `http://localhost:5001/api/properties/${req.originalPropertyId}`
            );
            return { ...req, original: original.data };
          } catch {
            return req;
          }
        }
        return req;
      })
    );
    setRequests(requestsWithOriginals);
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (id) => {
    await axios.post(`http://localhost:5001/api/properties/approve/${id}`);
    fetchPending();
  };

  const handleReject = async (id) => {
    await axios.delete(`http://localhost:5001/api/properties/reject/${id}`);
    fetchPending();
  };

  const highlightClass = (field, req) =>
    req.original && req.original[field] !== req[field]
      ? "bg-yellow-100 border-l-4 border-yellow-500 pl-2"
      : "";

  const filteredRequests =
    filterType === "all"
      ? requests
      : requests.filter((r) => r.requestType === filterType);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="mb-6 text-center">
        <label className="mr-3 font-medium">Filter by Request Type:</label>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="all">All</option>
          <option value="add">Add</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
      </div>

      {filteredRequests.length === 0 ? (
        <p className="text-center text-gray-600">No matching requests.</p>
      ) : (
        <div className="space-y-6">
          {filteredRequests.map((req) => (
            <div key={req._id} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex flex-col md:flex-row gap-6">
                {req.image && (
                  <img
                    src={`http://localhost:5001/uploads/${req.image}`}
                    alt={req.title}
                    className="h-48 w-full md:w-64 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-3">Requested Changes</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <h3 className="font-semibold">New</h3>
                      <p className={`text-gray-700 ${highlightClass("title", req)}`}>Title: {req.title}</p>
                      <p className={`text-gray-700 ${highlightClass("description", req)}`}>Description: {req.description}</p>
                      <p className={`text-gray-700 ${highlightClass("propertyType", req)}`}>Type: {req.propertyType}</p>
                      <p className={`text-gray-700 ${highlightClass("district", req)}`}>District: {req.district}</p>
                      <p className={`text-gray-700 ${highlightClass("price", req)}`}>Price: LKR {req.price?.toLocaleString()}</p>
                      <p className={`text-gray-700 ${highlightClass("contactName", req)}`}>Contact Name: {req.contactName}</p>
                      <p className={`text-gray-700 ${highlightClass("contactNumber", req)}`}>Contact No: {req.contactNumber}</p>
                    </div>
                    {req.original && (
                      <div className="space-y-1">
                        <h3 className="font-semibold">Original</h3>
                        <p className="text-gray-600">Title: {req.original.title}</p>
                        <p className="text-gray-600">Description: {req.original.description}</p>
                        <p className="text-gray-600">Type: {req.original.propertyType}</p>
                        <p className="text-gray-600">District: {req.original.district}</p>
                        <p className="text-gray-600">Price: LKR {req.original.price?.toLocaleString()}</p>
                        <p className="text-gray-600">Contact Name: {req.original.contactName}</p>
                        <p className="text-gray-600">Contact No: {req.original.contactNumber}</p>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    Request Type: <span className="capitalize font-medium">{req.requestType}</span>
                  </p>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => handleApprove(req._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(req._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
