import React, { useState } from "react";
import axios from "axios";
import { DISTRICTS } from "../constants/districts";

const PropertyTable = ({ properties, refresh }) => {
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({});

  const handleEditClick = (property) => {
    setEditing(property._id);
    setFormData({ ...property });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async () => {
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("contactName", formData.contactName);
    data.append("contactNumber", formData.contactNumber);
    data.append("propertyType", formData.propertyType);
    data.append("district", formData.district);
    data.append("price", formData.price);
    data.append("originalPropertyId", formData._id);

    try {
      await axios.post("http://localhost:5001/api/properties/update", data);
      alert("Update request sent.");
      setEditing(null);
    } catch (err) {
      console.error("Failed to send update request", err);
    }
  };

  const handleDeleteRequest = async (id) => {
    const confirmed = confirm("Send delete request for this property?");
    if (!confirmed) return;

    await axios.delete(`http://localhost:5001/api/properties/delete/${id}`);
    alert("Delete request sent.");
    refresh();
  };

  return (
    <table className="w-full text-left border mt-6">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-3">Title</th>
          <th className="p-3">Description</th>
          <th className="p-3">Type</th>
          <th className="p-3">District</th>
          <th className="p-3">Price</th>
          <th className="p-3">Contact</th>
          <th className="p-3">Actions</th>
        </tr>
      </thead>
      <tbody>
        {properties.map((prop) => (
          <tr key={prop._id} className="border-t">
            <td className="p-3">
              {editing === prop._id ? (
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="border p-1 rounded w-full"
                />
              ) : (
                prop.title
              )}
            </td>
            <td className="p-3">
              {editing === prop._id ? (
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="border p-1 rounded w-full"
                />
              ) : (
                prop.description
              )}
            </td>
            <td className="p-3 capitalize">
              {editing === prop._id ? (
                <select
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className="border p-1 rounded w-full"
                >
                  <option value="rent">Rent</option>
                  <option value="selling">Selling</option>
                </select>
              ) : (
                prop.propertyType
              )}
            </td>
            <td className="p-3">
              {editing === prop._id ? (
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="border p-1 rounded w-full"
                >
                  <option value="">Select District</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              ) : (
                prop.district
              )}
            </td>
            <td className="p-3">
              {editing === prop._id ? (
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="border p-1 rounded w-full"
                />
              ) : (
                `LKR ${prop.price?.toLocaleString()} ${
                  prop.propertyType === "rent" ? "(Monthly)" : "(Total)"
                }`
              )}
            </td>
            <td className="p-3">
              {editing === prop._id ? (
                <>
                  <input
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleChange}
                    className="border p-1 rounded mb-1 w-full"
                    placeholder="Name"
                  />
                  <input
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="border p-1 rounded w-full"
                    placeholder="Number"
                  />
                </>
              ) : (
                `${prop.contactName} (${prop.contactNumber})`
              )}
            </td>
            <td className="p-3 space-x-2">
              {editing === prop._id ? (
                <>
                  <button
                    onClick={handleUpdateSubmit}
                    className="bg-green-500 px-3 py-1 rounded text-white"
                  >
                    Send Request
                  </button>
                  <button
                    onClick={() => setEditing(null)}
                    className="bg-gray-400 px-3 py-1 rounded text-white"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEditClick(prop)}
                    className="bg-yellow-400 px-3 py-1 rounded text-white"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteRequest(prop._id)}
                    className="bg-red-500 px-3 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PropertyTable;
