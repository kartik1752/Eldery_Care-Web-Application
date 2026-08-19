const express = require("express");
const router = express.Router();
const AdminModel=require("../Model/Admin");
const FamilyModel=require("../Model/Family");
const ElderModel=require("../Model/Elder");
const TrackActivityModel=require("../Model/TrackActivity");
const ElderForums = require("../Model/ElderForums");
const EldersVolunteerTaskModel=require("../Model/EldersTaks");
const ChatMessage = require("../Model/ChatMessage");

router.post("/forums", async (req, res) => {
    const { forum, name } = req.body; 


    if (!forum || !name) {
        return res.status(400).json({ message: "Forum and name are required!" });
    }

    try {
        const CreateElderForum = new ElderForums({
            name,
            forum, 
        });

        await CreateElderForum.save();
        return res.status(201).json({ message: "Forum added successfully!" });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong!", error: err.message });
    }
});

router.get("/getElders", async (req, res) => {
  try {
    // If elders are stored in ElderModel:
    let elders = await ElderModel.find();

    // Fallback: If ElderModel is empty, query your main FamilyModel/UserModel for users with role "Elder"
    if (elders.length === 0) {
      elders = await FamilyModel.find({ 
        role: { $regex: /^elder$/i } 
      });
    }

    return res.status(200).json(elders);
  } catch (err) {
    return res.status(500).json({ 
      message: "Something went wrong!", 
      error: err.message 
    });
  }
});

router.get("/getChatHistory", async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ timestamp: 1 }).limit(100);
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return res.status(500).json({ message: "Server error fetching chat history" });
  }
});

router.post("/UpdatetrackActivity", async (req, res) => {
    const { email, stepCount, sleepHours, yogaTime } = req.body;
    
    try {
        const updateFields = {};
        if (stepCount !== undefined) updateFields.stepCount = stepCount;
        if (sleepHours !== undefined) updateFields.sleepHours = sleepHours;
        if (yogaTime !== undefined) updateFields.yogaTime = yogaTime;

        // upsert: true will automatically create the document if it doesn't exist
        const updatedUser = await TrackActivityModel.findOneAndUpdate(
            { email },
            { $set: updateFields },
            { new: true, upsert: true }
        );

        return res.status(200).json({ 
            message: "Activity updated successfully!", 
            stepCount: updatedUser.stepCount || "0",
            sleepHours: updatedUser.sleepHours || "0",
            yogaTime: updatedUser.yogaTime || "0"
        });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong while updating!", error: err.message });
    }
});

router.put("/updateTaskStatus", async (req, res) => {
    const { email, taskId, status } = req.body;

    if (!email || !taskId || !status) {
        return res.status(400).json({ message: "Email, taskId, and status are required." });
    }

    try {
        const updatedElder = await EldersVolunteerTaskModel.findOneAndUpdate(
            { email, "tasks._id": taskId },
            { $set: { "tasks.$.status": status } },
            { new: true }
        );

        if (!updatedElder) {
            return res.status(404).json({ message: "Task or user not found." });
        }

        return res.status(200).json({ message: "Task status updated successfully!", tasks: updatedElder.tasks });
    } catch (error) {
        console.error("Error updating task status:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


router.post("/getActivity", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await TrackActivityModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            stepCount: user.stepCount || "0",
            sleepHours: user.sleepHours || "0",
            yogaTime: user.yogaTime || "0"
        });
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong!" });
    }
});


router.post("/addTask", async (req, res) => {
    const { email, task, status } = req.body;

    try {
        let user = await EldersVolunteerTaskModel.findOne({ email });

        if (!user) {
            // If user doesn't exist, create a new one with the task
            user = new EldersVolunteerTaskModel({
                email,
                tasks: [{ task, status }]
            });
            await user.save();
            return res.status(201).json({ message: "User created and task added successfully!" });
        } else {
            // If user exists, push the new task to their tasks array
            await EldersVolunteerTaskModel.updateOne(
                { email },
                { $push: { tasks: { task, status } } }
            );
            return res.status(200).json({ message: "Task added successfully!" });
        }
    } catch (err) {
        return res.status(500).json({ message: "Something went wrong!" });
    }
});

router.get("/getTasks", async (req, res) => {
    const { email } = req.query;
    
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const elder = await EldersVolunteerTaskModel.findOne({ email });

        if (!elder) {
            return res.status(404).json({ message: "No tasks found" });
        }

        return res.status(200).json({ tasks: elder.tasks || [] });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = router;

