import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SignUp } from "./Components/SignUp";
import { Login } from "./Components/Login";
import { AdminDashBoard } from "./Components/AdminDashBoard";
import { ElderDashBoard } from "./Components/ElderDashBoard";
import { FamilyDashBoard } from "./Components/FamilyDashBoard";
import "./App.css";

function App() {
  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} /> {/* Redirect to signup */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashBoard />} />
        <Route path="/elder-dashboard" element={<ElderDashBoard />} />
        <Route path="/family-dashboard" element={<FamilyDashBoard />} />
      </Routes>
    </Router>
  );
}

export default App;
