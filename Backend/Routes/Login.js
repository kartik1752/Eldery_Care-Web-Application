const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const AdminModel = require("../Model/Admin");
const FamilyModel = require("../Model/Family");
const ElderModel = require("../Model/Elder");

router.post("/check", async (req, res) => {
    const { email, password, role } = req.body;
    let user;

    if (role === "Admin") {
        user = await AdminModel.findOne({ email });
    } else if (role === "Family") {
        user = await FamilyModel.findOne({ email });
    } else if (role === "Elder") {
        user = await ElderModel.findOne({ email });
    } else {
        return res.status(400).json({ message: "Invalid role!" });
    }

    if (!user) {
        return res.status(404).json({ message: `${role} not found!` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid Password!" });
    }

    return res.status(200).json({ 
        message: "Login Successfully!", 
        role, 
        name: user.name,  // Assuming your schema has a 'name' field
        email: user.email // Returning email as well
    });
});


module.exports = router;
