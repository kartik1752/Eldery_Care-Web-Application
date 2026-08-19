import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SignUp } from "./Components/SignUp";
import { Login } from "./Components/Login";
import { AdminDashBoard } from "./Components/AdminDashBoard";
import { ElderDashBoard } from "./Components/ElderDashBoard";
import { FamilyDashBoard } from "./Components/FamilyDashBoard";
import { ProtectedRoute } from "./Components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />

        {/* Role-Protected Routes */}
        <Route 
          path="/admin-dashboard" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashBoard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/elder-dashboard" 
          element={
            <ProtectedRoute allowedRole="elder">
              <ElderDashBoard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/family-dashboard" 
          element={
            <ProtectedRoute allowedRole="family">
              <FamilyDashBoard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;