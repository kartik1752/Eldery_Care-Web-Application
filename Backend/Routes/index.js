const express = require("express");
const Router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");
const allowRoles = require("../Middleware/roleMiddleware");

const Elder = require("./Elder");
const Family = require("./Family");
const Login = require("./Login");
const Signup = require("./SignUp");
const Admin = require("./Admin"); // 1. Require your Admin route file

// Public authentication routes
Router.use("/signup", Signup);
Router.use("/login", Login);

// Admin route
Router.use("/admin", Admin); // 2. Mount admin route at /api/admin

// Role-protected API routes
Router.use("/elder", authMiddleware, allowRoles("elder", "family", "admin"), Elder);
Router.use("/family", authMiddleware, allowRoles("family", "admin"), Family);

module.exports = Router;