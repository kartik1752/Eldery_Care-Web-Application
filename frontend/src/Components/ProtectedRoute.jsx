import React from "react";
import { Link } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole"); // Expects 'elder', 'family', or 'admin'

  // 1. If no token exists, prompt user to Sign In / Sign Up
  if (!token) {
    return (
      <div className="min-h-screen bg-[#F9EDE1] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-[#5A4230] mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">
            Please sign in or sign up to view this dashboard.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/login"
              className="bg-[#C48F65] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#A77250] transition duration-300"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="bg-gray-200 text-[#5A4230] px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. If logged in but attempting to access a dashboard not allowed for their role
  if (allowedRole && userRole !== allowedRole) {
    // Map existing role to its designated dashboard route
    const dashboardRoutes = {
      elder: "/elder-dashboard",
      family: "/family-dashboard",
      admin: "/admin-dashboard"
    };

    const myDashboard = dashboardRoutes[userRole] || "/login";

    return (
      <div className="min-h-screen bg-[#F9EDE1] flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Unauthorized Access</h2>
          <p className="text-gray-600 mb-6">
            You do not have permission to view this page with your <b>{userRole}</b> account.
          </p>
          <Link
            to={myDashboard}
            className="inline-block bg-[#C48F65] text-white px-5 py-2 rounded-lg font-semibold hover:bg-[#A77250] transition duration-300"
          >
            Go to My Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // 3. User is authenticated and possesses the required role
  return children;
};