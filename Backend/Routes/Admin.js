const express = require("express");
const router = express.Router();
const ElderModel = require("../Model/Elder");
const FamilyModel = require("../Model/Family");

// Get all elders and family members
router.get("/getUsers", async (req, res) => {
  try {
    const elders = await ElderModel.find().select("-password");
    const familyMembers = await FamilyModel.find().select("-password");

    return res.status(200).json({ elders, familyMembers });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error fetching users" });
  }
});

// Delete a user permanently from either collection
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let deletedUser = await ElderModel.findByIdAndDelete(id);
    if (!deletedUser) {
      deletedUser = await FamilyModel.findByIdAndDelete(id);
    }

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found in either collection" });
    }

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error deleting user" });
  }
});

module.exports = router;