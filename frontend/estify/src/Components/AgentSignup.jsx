import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import BackgroundImage from "../assets/background.jpg"; // Adjust path as needed

const AgentSignup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    agencyName: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5001/api/agents/register", form);
      alert("Registration successful. You can now log in.");
      navigate("/agent-login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center relative flex items-center justify-center"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      {/* Background blur overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0" />

      {/* Form container */}
      <div className="relative z-10 max-w-md w-full bg-white/90 p-6 rounded-xl shadow-xl">
        <h2 className="text-xl font-bold mb-4 text-center text-green-700">Agent Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
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
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          <input
            type="text"
            name="agencyName"
            placeholder="Agency Name"
            value={form.agencyName}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <p className="text-sm text-gray-600">
            Already an Agent?{" "}
            <span
              onClick={() => navigate("/agent-login")}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              Login
            </span>
          </p>

          <button
            type="submit"
            className="bg-green-600 text-white p-2 rounded w-full hover:bg-green-700"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgentSignup;
