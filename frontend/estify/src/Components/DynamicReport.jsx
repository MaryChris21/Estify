import React, { useEffect, useState } from "react";
import axios from "axios";
import { DISTRICTS } from "../constants/districts";
import { Download } from "lucide-react";
import Papa from "papaparse";
import jsPDF from "jspdf";
import "jspdf-autotable";

const DynamicReport = () => {
  const [filters, setFilters] = useState({ type: "", status: "", district: "", agentId: "" });
  const [reportData, setReportData] = useState([]);
  const [agents, setAgents] = useState([]);

  const fetchAgents = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/agents");
      setAgents(res.data);
    } catch (err) {
      console.error("Failed to load agents", err);
    }
  };

  const fetchReport = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/properties/report", {
        params: filters
      });
      setReportData(res.data);
    } catch (err) {
      console.error("Error fetching report", err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const exportCSV = () => {
    const csv = Papa.unparse(reportData.map((item) => ({
      Title: item.title,
      Type: item.propertyType,
      District: item.district,
      Price: item.price,
      Status: item.status,
      Agent: item.postedByAgent?.email || "N/A"
    })));

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "property_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Title", "Type", "District", "Price", "Status", "Agent"];
    const tableRows = reportData.map((item) => [
      item.title,
      item.propertyType,
      item.district,
      `LKR ${item.price?.toLocaleString()}`,
      item.status,
      item.postedByAgent?.email || "-"
    ]);

    doc.autoTable({ head: [tableColumn], body: tableRows });
    doc.save("property_report.pdf");
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-6">Dynamic Property Report</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select name="type" value={filters.type} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Types</option>
          <option value="rent">Rent</option>
          <option value="selling">Selling</option>
        </select>

        <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
        </select>

        <select name="district" value={filters.district} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Districts</option>
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select name="agentId" value={filters.agentId} onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Agents</option>
          {agents.map((a) => (
            <option key={a._id} value={a._id}>{a.email}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-between items-center mb-4">
        <button onClick={fetchReport} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow">
          Generate Report
        </button>
        {reportData.length > 0 && (
          <div className="flex gap-3">
            <button onClick={exportCSV} className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
              <Download size={18} /> CSV
            </button>
            <button onClick={exportPDF} className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
              <Download size={18} /> PDF
            </button>
          </div>
        )}
      </div>

      {reportData.length > 0 ? (
        <div className="overflow-x-auto rounded border">
          <table className="min-w-full bg-white">
            <thead className="bg-green-100">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Type</th>
                <th className="p-3 text-left">District</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Agent</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item) => (
                <tr key={item._id} className="border-t">
                  <td className="p-3">{item.title}</td>
                  <td className="p-3 capitalize">{item.propertyType}</td>
                  <td className="p-3">{item.district}</td>
                  <td className="p-3">LKR {item.price?.toLocaleString()}</td>
                  <td className="p-3 capitalize">{item.status}</td>
                  <td className="p-3">{item.postedByAgent?.email || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-8">No data available. Please generate a report.</p>
      )}
    </div>
  );
};

export default DynamicReport;
