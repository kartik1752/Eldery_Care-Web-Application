const express = require("express");
const router = express.Router();
const AdminModel = require("../Model/Admin");
const FamilyModel = require("../Model/Family");
const ElderModel = require("../Model/Elder");
const TrackActivityModel=require("../Model/TrackActivity");
const EldersVolunteerTaskModel=require("../Model/EldersTaks");
const bcrypt = require("bcryptjs");


router.post("/", async (req, res) => {
    const { name, email, password, role } = req.body;

    if (role === "Family") {
        try {
            const member = await FamilyModel.findOne({ email }); 
            if (!member) {
                const salt = await bcrypt.genSalt(10);
                const hashedpassword = await bcrypt.hash(password, salt);
                const newFamilyMember = new FamilyModel({ name, email, password: hashedpassword, role });
                await newFamilyMember.save();
                return res.status(201).json({ message: "Account Created!" });
            } else {
                return res.status(400).json({ message: "User Already Exist" });
            }
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" });
        }
    }

    if (role === "Elder") {
        try {
            const elderMember = await ElderModel.findOne({ email }); 
            if (!elderMember) {
                const salt = await bcrypt.genSalt(10);
                const hashedpassword = await bcrypt.hash(password, salt);
                const newElderMember = new ElderModel({ name, email, password: hashedpassword, role });
                const newPhysicalActivity =new TrackActivityModel({
                    name,
                    email,
                    stepCount:"0",
                    sleepHours:"0",
                    yogaTime:"0"
                });
                const newElderVolunteerTask=new EldersVolunteerTaskModel({
                    email,
                    task:"",
                    status:""

                })

                await newElderMember.save();
                await newPhysicalActivity.save();
                await newElderVolunteerTask.save();

                return res.status(201).json({ message: "Account Created!" });
            } else {
                return res.status(400).json({ message: "User Already Exist" });
            }
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" });
        }
    }

    if (role === "Admin") {
        try {
            const adminMember = await AdminModel.findOne({ email }); 
            if (!adminMember) {
                const salt = await bcrypt.genSalt(10);
                const hashedpassword = await bcrypt.hash(password, salt);
                const newAdminMember = new AdminModel({ name, email, password: hashedpassword, role });
                await newAdminMember.save();
                return res.status(201).json({ message: "Account Created!" });
            } else {
                return res.status(400).json({ message: "User Already Exist" });
            }
        } catch (err) {
            return res.status(500).json({ message: "An error occurred" });
        }
    }
});

module.exports = router;
