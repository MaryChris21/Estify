import React, { useEffect, useState } from "react";
import axios from "axios";
import { DISTRICTS } from "../constants/districts";

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
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Properties</h1>

      <div className="mb-6 text-center space-y-4">
        <div>
          <label className="mr-2 font-medium">Filter by District:</label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            {DISTRICTS.map((district) => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center gap-4">
          <div>
            <label className="block text-sm font-medium">Min Price (LKR)</label>
            <input
              type="number"
              value={minPrice === 0 ? "" : minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value) || 0)}
              className="border p-2 rounded w-32"
              placeholder="Any"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Max Price (LKR)</label>
            <input
              type="number"
              value={maxPrice === Infinity ? "" : maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value) || Infinity)}
              className="border p-2 rounded w-32"
              placeholder="Any"
            />
          </div>
        </div>
      </div>

      {filteredProperties.length === 0 ? (
        <p className="text-center text-gray-600">No approved properties available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {property.image && (
                <img
                  src={`http://localhost:5001/uploads/${property.image}`}
                  alt={property.title}
                  className="h-48 w-full object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
                <p className="text-gray-700 mb-2">{property.description}</p>
                <p className="text-sm text-gray-600">
                  Type: <span className="capitalize font-medium">{property.propertyType}</span>
                </p>
                <p className="text-sm text-gray-600">
                  District: <span className="font-medium">{property.district}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Price: <span className="font-medium">
                    LKR {property.price?.toLocaleString()} {property.propertyType === "rent" ? "(Monthly)" : "(Total)"}
                  </span>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Contact Person: <span className="font-medium">{property.contactName}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Contact Number: <span className="font-medium">{property.contactNumber}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProperties;
