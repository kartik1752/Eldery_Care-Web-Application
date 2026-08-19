const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminModel = require("../Model/Admin");
const FamilyModel = require("../Model/Family");
const ElderModel = require("../Model/Elder");

router.post("/check", async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!role) {
            return res.status(400).json({ message: "Role is required!" });
        }

        // Normalize role to lowercase for clean comparisons across the app
        const normalizedRole = role.toLowerCase();
        let user;

        // Find user according to role
        if (normalizedRole === "admin") {
            user = await AdminModel.findOne({ email });
        } 
        else if (normalizedRole === "family") {
            user = await FamilyModel.findOne({ email });
        } 
        else if (normalizedRole === "elder") {
            user = await ElderModel.findOne({ email });
        } 
        else {
            return res.status(400).json({ message: "Invalid role!" });
        }

        // User doesn't exist
        if (!user) {
            return res.status(404).json({
                message: `${role} not found!`
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid Password!"
            });
        }

        // Generate JWT with normalized role
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: normalizedRole,
                name: user.name
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "12h"
            }
        );

        // Send token & user details to frontend
        return res.status(200).json({
            message: "Login Successfully!",
            token: token,
            role: normalizedRole,
            name: user.name,
            email: user.email
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            message: "Server error"
        });
    }
});

module.exports = router;