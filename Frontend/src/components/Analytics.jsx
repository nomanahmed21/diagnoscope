import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import "./Analytics.css";

const Analytics = () => {
  const [data, setData] = useState([]);
  const [testName, setTestName] = useState("Diabetes"); // Default test name
  const userData = useSelector((state) => state.user.user); // User from Redux

  // Fetch data whenever testName changes
  const fetchAnalytics = async (selectedTest) => {
    if (!userData || !userData.userId) {
      console.error("User not found in Redux state");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/analytics/user?userId=${userData.userId}&testName=${selectedTest}&limit=10`
      );
      const result = await response.json();

      // Format timestamp for better display
      const formattedData = result.map((item) => ({
        ...item,
        timestamp: new Date(item.timestamp).toLocaleDateString(),
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

const clearAndFetchAnalysis = async () => {
  console.log("Refresh button clicked!"); 
  try {
    const response = await fetch("http://localhost:5000/api/analytics/clear", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
console.log("Raw response status:", response.status);
console.log("Raw response body:", result);

    if (response.ok) {
      console.log("Cache cleared:", result);
      await fetchAnalytics(testName); // Fetch fresh analytics
    } else {
      console.error("Error clearing cache:", result.message);
    }
  } catch (error) {
    console.error("Error clearing analytics cache:", error);
    alert("Failed to clear analytics cache.");
  }
};



  // Call fetchAnalytics whenever the selected test changes
  useEffect(() => {
    fetchAnalytics(testName);
  }, [testName]);

  return (
    <div className="analytics-container">
      <h1 className="analytics-title">Analytics</h1>

      {/* Dropdown for selecting test name */}
      <div className="dropdown-container">
        <label htmlFor="test-select" className="dropdown-label">
          Select Test:
        </label>
        <select
          id="test-select"
          className="dropdown"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
        >
          <option value="Diabetes">Diabetes</option>
          <option value="HeartDisease">Heart Disease</option>
          <option value="Cancer">Cancer</option>
        </select>

        {/* Refresh Button */}
        <button
          className="refresh-button"
          onClick={() => clearAndFetchAnalysis()}
        >
          ⟳
        </button>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <h2 className="chart-title">Prediction Trend</h2>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="chance" // Change this key to match your backend field
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data">No data available for this test.</p>
        )}
      </div>
    </div>
  );
};

export default Analytics;
