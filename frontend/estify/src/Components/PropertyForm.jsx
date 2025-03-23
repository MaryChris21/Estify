import React, { useState } from "react";
import axios from "axios";

const PropertyForm = ({ isUpdate = false, originalPropertyId = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    contactName: "",
    contactNumber: "",
    propertyType: "rent",
    image: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.contactName.trim()) newErrors.contactName = "Contact name is required";
    if (!/^[0-9]{10}$/.test(formData.contactNumber)) newErrors.contactNumber = "Enter a valid 10-digit mobile number";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = new FormData();
    for (let key in formData) {
      if (formData[key] !== null) data.append(key, formData[key]);
    }
    if (isUpdate) data.append("originalPropertyId", originalPropertyId);

    try {
      const url = isUpdate
        ? "http://localhost:5001/api/properties/update"
        : "http://localhost:5001/api/properties/add";

      const response = await axios.post(url, data);
      alert(response.data.message);
      setFormData({
        title: "",
        description: "",
        contactName: "",
        contactNumber: "",
        propertyType: "rent",
        image: null,
      });
      setErrors({});
    } catch (err) {
      console.error("Submit Error:", err);
      const errorMessage = err.response?.data?.message || "Error submitting form";
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">{isUpdate ? "Update Property" : "Add New Property"}</h2>

      <div>
        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          value={formData.title}
          className="border p-3 w-full rounded"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          value={formData.description}
          className="border p-3 w-full rounded"
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <input
          name="contactName"
          placeholder="Contact Name"
          onChange={handleChange}
          value={formData.contactName}
          className="border p-3 w-full rounded"
        />
        {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
      </div>

      <div>
        <input
          name="contactNumber"
          placeholder="Contact Number"
          onChange={handleChange}
          value={formData.contactNumber}
          className="border p-3 w-full rounded"
        />
        {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
      </div>

      <select
        name="propertyType"
        onChange={handleChange}
        value={formData.propertyType}
        className="border p-3 w-full rounded"
      >
        <option value="rent">Rent</option>
        <option value="selling">Selling</option>
      </select>

      <input type="file" name="image" onChange={handleChange} className="border p-3 w-full rounded" />

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white p-3 w-full rounded"
      >
        {isUpdate ? "Submit Update" : "Add Property"}
      </button>
    </form>
  );
};

export default PropertyForm;
