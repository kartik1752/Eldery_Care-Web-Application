import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";// Or react-toastify if installed
import { FaTrash, FaUserShield, FaUserFriends, FaUserAlt } from "react-icons/fa";

export const AdminDashBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || localStorage.getItem("userEmail") || "";
  const name = location.state?.name || localStorage.getItem("userName") || "Admin";

  const [elders, setElders] = useState([]);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/getUsers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();

      if (response.ok) {
        setElders(data.elders || []);
        setFamilyMembers(data.familyMembers || []);
      } else {
        console.error("Failed to fetch users:", data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userRole) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this user?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/deleteUser/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        if (userRole === "elder") {
          setElders((prev) => prev.filter((user) => user._id !== userId));
        } else {
          setFamilyMembers((prev) => prev.filter((user) => user._id !== userId));
        }
        alert("User permanently removed from database");
      } else {
        alert(data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Server error occurred while deleting user");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-[#F9EDE1]">
      {/* Navbar */}
      <nav className="bg-white shadow-md flex justify-between items-center p-4">
        <div className="flex items-center">
          <img
            src="https://media.istockphoto.com/id/1211589384/vector/bearded-man-profile-avatar-black-hair-vector-illustration.jpg?s=612x612&w=0&k=20&c=BSAOjjBzYXxAlNVHsMAhtchok8Vd7JJG4XA0yBkdwxw="
            alt="Profile"
            className="w-10 h-10 rounded-full mr-3 border border-[#C48F65]"
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

      {/* Main Content */}
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-[#5A4230] flex items-center gap-2">
            <FaUserShield className="text-[#C48F65]" /> Admin Dashboard
          </h2>
          <p className="text-gray-600 text-sm mt-1">Logged in as: {email}</p>
        </div>

        {loading ? (
          <div className="text-center py-10 text-[#5A4230] font-semibold">
            Loading users...
          </div>
        ) : (
          /* Two Column Grid for Elders and Family Members */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: Elders */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h3 className="text-xl font-bold text-[#5A4230] flex items-center gap-2">
                  <FaUserAlt className="text-[#C48F65]" /> Elders Directory
                </h3>
                <span className="bg-[#F9EDE1] text-[#5A4230] text-xs font-bold px-2.5 py-1 rounded-full">
                  {elders.length} Total
                </span>
              </div>

              {elders.length > 0 ? (
                <div className="space-y-3">
                  {elders.map((elder) => (
                    <div
                      key={elder._id}
                      className="flex items-center justify-between p-3 bg-[#F9EDE1] rounded-lg border border-gray-200 hover:shadow-sm transition"
                    >
                      <div>
                        <p className="font-semibold text-[#5A4230]">{elder.name || "N/A"}</p>
                        <p className="text-xs text-gray-600">{elder.email}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(elder._id, "elder")}
                        className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-lg text-sm font-medium transition flex items-center gap-1"
                        title="Delete User"
                      >
                        <FaTrash size={14} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic py-4">No elders registered yet.</p>
              )}
            </div>

            {/* Column 2: Family Members */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-4 border-b pb-3">
                <h3 className="text-xl font-bold text-[#5A4230] flex items-center gap-2">
                  <FaUserFriends className="text-[#C48F65]" /> Family Members Directory
                </h3>
                <span className="bg-[#F9EDE1] text-[#5A4230] text-xs font-bold px-2.5 py-1 rounded-full">
                  {familyMembers.length} Total
                </span>
              </div>

              {familyMembers.length > 0 ? (
                <div className="space-y-3">
                  {familyMembers.map((family) => (
                    <div
                      key={family._id}
                      className="flex items-center justify-between p-3 bg-[#F9EDE1] rounded-lg border border-gray-200 hover:shadow-sm transition"
                    >
                      <div>
                        <p className="font-semibold text-[#5A4230]">{family.name || "N/A"}</p>
                        <p className="text-xs text-gray-600">{family.email}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(family._id, "family")}
                        className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-lg text-sm font-medium transition flex items-center gap-1"
                        title="Delete User"
                      >
                        <FaTrash size={14} /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic py-4">
                  No family members registered yet.
                </p>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};