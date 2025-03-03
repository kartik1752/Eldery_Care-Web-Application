import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const AdminDashBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email } = location.state || {};

  const handleLogout = () => {
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-[#F9EDE1]">
      
      <nav className="bg-white shadow-md flex justify-between items-center p-4">
        
        <div className="flex items-center">
          <img
            src="https://media.istockphoto.com/id/1211589384/vector/bearded-man-profile-avatar-black-hair-vector-illustration.jpg?s=612x612&w=0&k=20&c=BSAOjjBzYXxAlNVHsMAhtchok8Vd7JJG4XA0yBkdwxw="
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3"
          />
          <span className="text-[#5A4230] font-semibold text-lg">Welcome, {name}!</span>
        </div>

        
        <button
          onClick={handleLogout}
          className="bg-[#C48F65] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#A77250] transition duration-300"
        >
          Logout
        </button>
      </nav>

      
      <div className="p-6">
        <h2 className="text-2xl font-bold text-[#5A4230]">Admin Dashboard</h2>
        <p className="text-gray-700 mt-2">Email: {email}</p>
        
      </div>
    </div>
  );
};
