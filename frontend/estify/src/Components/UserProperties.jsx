import React, { useEffect, useState } from "react";
import axios from "axios";
import { DISTRICTS } from "../constants/districts";
import { MapPin, Home, Phone } from "lucide-react";
import { motion } from "framer-motion";
import LayoutWrapper from "../Components/LayoutWrapper";

const UserProperties = () => {
  const [properties, setProperties] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/properties");
        setProperties(res.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, []);

  const filteredProperties = properties.filter((p) => {
    const matchesDistrict = selectedDistrict === "all" || p.district === selectedDistrict;
    const matchesPrice = p.price >= minPrice && p.price <= maxPrice;
    return matchesDistrict && matchesPrice;
  });

  return (
    <LayoutWrapper>
      <div className="p-6">
        <h1 className="text-4xl font-bold text-center text-green-700 mb-8">Explore Properties</h1>

        <div className="mb-10 flex flex-wrap justify-center gap-6 items-end">
          {/* District Filter */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">District:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="border rounded p-2 w-48 shadow-sm"
            >
              <option value="all">All</option>
              {DISTRICTS.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          {/* Min Price */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Min Price (LKR)</label>
            <input
              type="number"
              value={minPrice === 0 ? "" : minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
              className="border p-2 rounded w-40 shadow-sm"
              placeholder="Any"
            />
          </div>

          {/* Max Price */}
          <div className="flex flex-col">
            <label className="font-medium text-gray-700 mb-1">Max Price (LKR)</label>
            <input
              type="number"
              value={maxPrice === Infinity ? "" : maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value) || Infinity)}
              className="border p-2 rounded w-40 shadow-sm"
              placeholder="Any"
            />
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No properties found for selected filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => (
              <motion.div
                key={property._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white border rounded-xl shadow-md overflow-hidden"
              >
                {property.image && (
                  <img
                    src={`http://localhost:5001/uploads/${property.image}`}
                    alt={property.title}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-4 space-y-2">
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Home size={18} className="text-emerald-500" /> {property.title}
                  </h2>
                  <p className="text-gray-600 text-sm line-clamp-2">{property.description}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin size={14} /> {property.district}
                  </p>
                  <p className="text-emerald-600 font-bold">
                    LKR {property.price?.toLocaleString()} {" "}
                    <span className="text-sm text-gray-500">
                      ({property.propertyType === "rent" ? "Monthly" : "Total"})
                    </span>
                  </p>
                  <p className="text-sm text-gray-700 flex items-center gap-1">
                    <Phone size={14} /> {property.contactName} ({property.contactNumber})
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </LayoutWrapper>
  );
};

export default UserProperties;
