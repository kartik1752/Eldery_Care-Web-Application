import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const ElderDashBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email } = location.state || {};

  const [showModal, setShowModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [updatedValue, setUpdatedValue] = useState("");
  const [activityData, setActivityData] = useState({
    stepCount: "0",
    sleepHours: "0",
    yogaTime: "0"
  });

  // Fetch elder's activity data on component mount
  useEffect(() => {
    fetchActivityData();
  }, []);

  const fetchActivityData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/elder/getActivity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        setActivityData({
          stepCount: data.stepCount || "0",
          sleepHours: data.sleepHours || "0",
          yogaTime: data.yogaTime || "0"
        });
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error fetching activity data:", error);
    }
  };

  const handleUpdateActivity = async () => {
    try {
      // Map selectedMetric to the correct backend field key
      const metricMap = {
        "Step Count": "stepCount",
        "Sleep Hours": "sleepHours",
        "Yoga Time": "yogaTime"
      };

      const updatedField = metricMap[selectedMetric]; // Get the correct key

      if (!updatedField) {
        console.error("Invalid metric selected.");
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/elder/UpdatetrackActivity`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          [updatedField]: updatedValue  // Correctly mapped field
        })
      });

      const data = await response.json();
      if (response.ok) {
        setActivityData((prev) => ({
          ...prev,
          [updatedField]: data[updatedField] || "0"
        }));
        closeModal();
      } else {
        console.error("Error updating activity:", data.message);
      }
    } catch (error) {
      console.error("Error updating activity data:", error);
    }
};


  const openModal = (metric) => {
    setSelectedMetric(metric);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMetric("");
    setUpdatedValue("");
  };

  return (
    <div className="min-h-screen bg-[#F9EDE1] flex">
      {/* Left Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <nav className="bg-white shadow-md flex justify-between items-center p-4 fixed top-0 left-0 right-0 z-10">
          <div className="flex items-center">
            <img
              src="https://media.istockphoto.com/id/2150423411/vector/grandparents-day.jpg?s=612x612&w=0&k=20&c=P6pegV6cd3ZYKXpNMdzqqD21fm14TEA2UAQBu9oCO5o="
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="text-[#5A4230] font-semibold text-lg">Welcome, {name}!</span>
          </div>
          <button
            onClick={() => navigate("/signup")}
            className="bg-[#C48F65] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#A77250] transition duration-300"
          >
            Logout
          </button>
        </nav>

        {/* Content Section */}
        <div className="p-6 mt-16">
          <h2 className="text-2xl font-bold text-[#5A4230]">Elder's Dashboard</h2>
          <p className="text-gray-700 mt-2">Email: {email}</p>
        </div>
      </div>

      {/* Right Sidebar - Fixed & No Overlap */}
      <div className="w-1/4 bg-white shadow-lg p-4 flex flex-col items-center fixed right-0 top-16 bottom-0 overflow-y-auto">
        <h3 className="text-xl font-bold text-[#5A4230] mb-4">Physical Activity Tracker</h3>

        {/* Activity Cards */}
        {[
          { label: "Step Count", key: "stepCount" },
          { label: "Sleep Hours", key: "sleepHours" },
          { label: "Yoga Time", key: "yogaTime" }
        ].map(({ label, key }) => (
          <div key={label} className="w-full mb-4 p-4 bg-[#F9EDE1] rounded-lg shadow">
            <h4 className="text-lg font-semibold text-[#5A4230]">{label}</h4>
            <p className="text-gray-700">{activityData[key]}hrs</p>
            <button
              onClick={() => openModal(label)}
              className="mt-2 bg-[#C48F65] text-white px-3 py-1 rounded-md hover:bg-[#A77250] transition"
            >
              Update
            </button>
          </div>
        ))}
      </div>

      {/* Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold text-[#5A4230]">Update {selectedMetric}</h3>
            <input
              type="number"
              placeholder={`Enter ${selectedMetric}`}
              className="mt-3 w-full p-2 border border-gray-300 rounded-md"
              value={updatedValue}
              onChange={(e) => setUpdatedValue(e.target.value)}
            />
            <div className="flex justify-between mt-4">
              <button onClick={closeModal} className="bg-gray-400 text-white px-3 py-1 rounded-md">Cancel</button>
              <button onClick={handleUpdateActivity} className="bg-[#C48F65] text-white px-3 py-1 rounded-md hover:bg-[#A77250] transition">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
