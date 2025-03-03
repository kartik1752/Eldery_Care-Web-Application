const mongoose = require("mongoose");

const EldersVolunteerTaskSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    tasks: [
        {
            task: { type: String, required: true },
            status: { type: String, required: true }
        }
    ]
});

module.exports = mongoose.model("EldersVolunteerTask", EldersVolunteerTaskSchema);
