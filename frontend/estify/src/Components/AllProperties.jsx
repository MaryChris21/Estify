import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyTable from "../Components/PropertyTable";
import LayoutWrapper from "../Components/LayoutWrapper"; // ✅ import the layout wrapper

const AllProperties = () => {
  const [properties, setProperties] = useState([]);

  const fetchProperties = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/properties");
      setProperties(res.data);
    } catch (err) {
      console.error("Failed to fetch properties", err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <LayoutWrapper>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4 text-center text-green-700">All Approved Properties</h1>
        <PropertyTable properties={properties} refresh={fetchProperties} />
      </div>
    </LayoutWrapper>
  );
};

export default AllProperties;
