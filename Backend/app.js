const express = require("express");
const app = express(); 
const index = require("./Routes/index");
const cors=require("cors");

app.use(express.json());
app.use(cors()); 

const { default: mongoose } = require("mongoose");

app.use("/api", index); 
mongoose.connect("mongodb+srv://kartik1752be22:kartik8562@cluster0.zbjel.mongodb.net/Elderly_Home?retryWrites=true&w=majority",)
    .then(() => {
        console.log("Connection Established Successfully");
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB:", err);
    });

const PORT = 5002;
app.listen(PORT, () => {
    console.log(`Backend is working on port ${PORT}`);
});
