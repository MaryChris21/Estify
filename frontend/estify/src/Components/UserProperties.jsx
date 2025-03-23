import React, { useEffect, useState } from "react";
import axios from "axios";

const UserProperties = () => {
  const [properties, setProperties] = useState([]);

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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Properties</h1>

      {properties.length === 0 ? (
        <p className="text-center text-gray-600">No approved properties available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
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
                <p className="text-sm text-gray-600">Type: <span className="capitalize font-medium">{property.propertyType}</span></p>
                <p className="text-sm text-gray-600 mt-2">Contact Person: <span className="font-medium">{property.contactName}</span></p>
                <p className="text-sm text-gray-600">Contact Number: <span className="font-medium">{property.contactNumber}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProperties;
