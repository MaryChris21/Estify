import React, { useState } from "react";
import axios from "axios";
import { DISTRICTS } from "../constants/districts";

const PropertyForm = ({ isUpdate = false, originalPropertyId = null }) => {
  const initialFormState = {
    title: "",
    description: "",
    contactName: "",
    contactNumber: "",
    propertyType: "rent",
    district: "",
    price: "",
    image: null,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title || formData.title.length < 3) newErrors.title = "Title must be at least 3 characters.";
    if (!formData.description || formData.description.length < 10) newErrors.description = "Description must be at least 10 characters.";
    if (!formData.contactName || !/^[A-Za-z\s]+$/.test(formData.contactName)) newErrors.contactName = "Contact name must contain only letters.";
    if (!formData.contactNumber || !/^[0-9]{10}$/.test(formData.contactNumber)) newErrors.contactNumber = "Contact number must be exactly 10 digits.";
    if (!formData.district) newErrors.district = "District is required.";
    if (formData.price === "" || Number(formData.price) < 0) newErrors.price = "Price must be a positive number.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const data = new FormData();
    for (let key in formData) data.append(key, formData[key]);
    if (isUpdate) data.append("originalPropertyId", originalPropertyId);

    try {
      const url = isUpdate
        ? "http://localhost:5001/api/properties/update"
        : "http://localhost:5001/api/properties/add";
      await axios.post(url, data);
      alert("Request submitted for approval.");
      setFormData(initialFormState);
    } catch (err) {
      alert("Error submitting form");
    }
  };

  const inputClass = (field) => `border p-3 w-full rounded ${errors[field] ? "border-red-500" : ""}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">
        {isUpdate ? "Update Property" : "Add New Property"}
      </h2>
      <div>
        <input
          name="title"
          placeholder="Title"
          minLength={3}
          value={formData.title}
          onChange={handleChange}
          className={inputClass("title")}
          required
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <textarea
          name="description"
          placeholder="Description"
          minLength={10}
          value={formData.description}
          onChange={handleChange}
          className={inputClass("description")}
          required
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <input
          name="contactName"
          placeholder="Contact Name"
          value={formData.contactName}
          onChange={handleChange}
          className={inputClass("contactName")}
          required
        />
        {errors.contactName && <p className="text-red-500 text-sm mt-1">{errors.contactName}</p>}
      </div>

      <div>
        <input
          name="contactNumber"
          placeholder="Contact Number"
          value={formData.contactNumber}
          onChange={handleChange}
          className={inputClass("contactNumber")}
          maxLength={10}
          required
        />
        {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
      </div>

      <select
        name="propertyType"
        onChange={handleChange}
        value={formData.propertyType}
        className="border p-3 w-full rounded"
        required
      >
        <option value="rent">Rent</option>
        <option value="selling">Selling</option>
      </select>

      <div>
        <input
          name="price"
          type="number"
          min={0}
          value={formData.price}
          placeholder={formData.propertyType === "rent" ? "Monthly Rent (LKR)" : "Total Price (LKR)"}
          onChange={handleChange}
          className={inputClass("price")}
          required
        />
        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>

      <div>
        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          className={inputClass("district")}
          required
        >
          <option value="">Select District</option>
          {DISTRICTS.map((district) => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
        {errors.district && <p className="text-red-500 text-sm mt-1">{errors.district}</p>}
      </div>

      <input
        type="file"
        name="image"
        onChange={handleChange}
        className="border p-3 w-full rounded"
      />

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
