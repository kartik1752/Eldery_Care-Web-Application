require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const mongoose = require("mongoose");

const index = require("./Routes/index");
const ChatMessage = require("./Model/ChatMessage");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api", index);

// Create HTTP Server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Real-time Socket.io Connection Handlers
io.on("connection", (socket) => {
  console.log("User connected to socket:", socket.id);

  socket.on("send_message", async (data) => {
    try {
      const { senderName, senderEmail, message } = data;

      // Save message directly to MongoDB
      const newMsg = new ChatMessage({
        senderName,
        senderEmail,
        message
      });
      await newMsg.save();

      // Broadcast message to all connected clients
      io.emit("receive_message", {
        _id: newMsg._id,
        senderName: newMsg.senderName,
        senderEmail: newMsg.senderEmail,
        message: newMsg.message,
        timestamp: newMsg.timestamp
      });
    } catch (err) {
      console.error("Error processing socket message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from socket:", socket.id);
  });
});

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connection Established Successfully");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

const PORT = process.env.PORT || 5000;

// Listen using the HTTP server instead of app.listen directly
server.listen(PORT, () => {
  console.log(`Backend is working on port ${PORT}`);
});