import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTasks, FaCheckCircle, FaRegCircle, FaPaperPlane, FaComments } from "react-icons/fa";
import { io } from "socket.io-client";

let socket;

export const ElderDashBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || localStorage.getItem("userEmail") || "";
  const name = location.state?.name || localStorage.getItem("userName") || "User";

  const [showModal, setShowModal] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("");
  const [updatedValue, setUpdatedValue] = useState("");
  const [tasks, setTasks] = useState([]);
  const [activityData, setActivityData] = useState({
    stepCount: "0",
    sleepHours: "0",
    yogaTime: "0"
  });

  // Chat State
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatBottomRef = useRef(null);

  useEffect(() => {
    if (email) {
      fetchActivityData();
      fetchTasks();
      fetchChatHistory();
    }

    // Initialize Socket Connection
    socket = io(import.meta.env.VITE_BACKEND_URL || "http://localhost:5000");

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [email]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/elder/getChatHistory`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(data || []);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      senderName: name,
      senderEmail: email,
      message: newMessage
    };

    socket.emit("send_message", messageData);
    setNewMessage("");
  };

  const fetchActivityData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/elder/getActivity`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();
      if (response.ok) {
        setActivityData({
          stepCount: data.stepCount || "0",
          sleepHours: data.sleepHours || "0",
          yogaTime: data.yogaTime || "0"
        });
      }
    } catch (error) {
      console.error("Error fetching activity data:", error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/elder/getTasks?email=${email}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(data.tasks || []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleToggleTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "Completed" ? "Pending" : "Completed";

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/elder/updateTaskStatus`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ email, taskId, status: newStatus })
      });

      const data = await response.json();
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
        );
        toast.success(`Task marked as ${newStatus}`);
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Server error");
    }
  };

  const handleUpdateActivity = async () => {
    try {
      const metricMap = {
        "Step Count": "stepCount",
        "Sleep Hours": "sleepHours",
        "Yoga Time": "yogaTime"
      };

      const updatedField = metricMap[selectedMetric];
      if (!updatedField) return;

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/elder/UpdatetrackActivity`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json", 
          Authorization: `Bearer ${localStorage.getItem("token")}` 
        },
        body: JSON.stringify({ email, [updatedField]: updatedValue })
      });

      const data = await response.json();
      if (response.ok) {
        setActivityData((prev) => ({
          ...prev,
          [updatedField]: data[updatedField] ?? updatedValue
        }));
        toast.success(`${selectedMetric} updated successfully!`);
        closeModal();
      } else {
        toast.error(data.message || "Failed to update activity");
      }
    } catch (error) {
      console.error("Error updating activity data:", error);
      toast.error("Server error during update");
    }
  };

  const openModal = (metric) => {
    setSelectedMetric(metric);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedMetric("");
    setUpdatedValue("");
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const metricsConfig = [
    { label: "Step Count", key: "stepCount", unit: "steps" },
    { label: "Sleep Hours", key: "sleepHours", unit: "hrs" },
    { label: "Yoga Time", key: "yogaTime", unit: "mins" }
  ];

  return (
    <div className="min-h-screen bg-[#F9EDE1] flex">
      <div className="flex-1 flex flex-col pr-[25%]">
        <nav className="bg-white shadow-md flex justify-between items-center p-4 fixed top-0 left-0 right-1/4 z-10">
          <div className="flex items-center">
            <img
              src="https://media.istockphoto.com/id/2150423411/vector/grandparents-day.jpg?s=612x612&w=0&k=20&c=P6pegV6cd3ZYKXpNMdzqqD21fm14TEA2UAQBu9oCO5o="
              alt="Profile"
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="text-[#5A4230] font-semibold text-lg">Welcome, {name}!</span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-[#C48F65] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#A77250] transition duration-300"
          >
            Logout
          </button>
        </nav>

        <div className="p-6 mt-16 max-w-3xl flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-bold text-[#5A4230]">Elder's Dashboard</h2>
            <p className="text-gray-700 mt-1">Email: {email}</p>
          </div>

          {/* Assigned Tasks Section */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-bold text-[#5A4230] mb-4 flex items-center">
              <FaTasks className="mr-2 text-[#C48F65]" /> Assigned Tasks
            </h3>
            {tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.map((t) => (
                  <div
                    key={t._id}
                    className="flex items-center justify-between p-3 bg-[#F9EDE1] rounded-lg border border-gray-200"
                  >
                    <div>
                      <h4
                        className={`font-semibold ${
                          t.status === "Completed"
                            ? "line-through text-gray-400"
                            : "text-[#5A4230]"
                        }`}
                      >
                        {t.task}
                      </h4>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          t.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleTaskStatus(t._id, t.status)}
                      className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                        t.status === "Completed"
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {t.status === "Completed" ? (
                        <>
                          <FaCheckCircle className="mr-1 text-green-600" /> Completed
                        </>
                      ) : (
                        <>
                          <FaRegCircle className="mr-1" /> Mark Complete
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No tasks assigned to you right now.</p>
            )}
          </div>

          {/* Real-time Community Chat Section */}
          <div className="bg-white rounded-xl shadow-md flex flex-col h-[450px] overflow-hidden border border-gray-200">
            <div className="bg-[#C48F65] text-white p-4 flex items-center shadow-sm">
              <FaComments className="text-2xl mr-3" />
              <div>
                <h3 className="font-bold text-lg leading-tight">Elders Community Chat</h3>
                <p className="text-xs text-amber-100">Connect and message with other members</p>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#efeae2] space-y-3">
              {messages.map((msg, index) => {
                const isMe = msg.senderEmail === email;
                const formattedTime = new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit"
                });

                return (
                  <div
                    key={msg._id || index}
                    className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-3 py-2 rounded-lg shadow-sm text-sm relative ${
                        isMe
                          ? "bg-[#dcf8c6] text-gray-800 rounded-tr-none"
                          : "bg-white text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {!isMe && (
                        <span className="block text-xs font-bold text-[#a77250] mb-0.5">
                          {msg.senderName}
                        </span>
                      )}
                      <p className="break-words leading-snug pr-10">{msg.message}</p>
                      <span className="text-[10px] text-gray-500 absolute bottom-1 right-2">
                        {formattedTime}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white flex items-center gap-2 border-t">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 border border-gray-300 px-4 py-2 rounded-full focus:outline-none focus:border-[#C48F65]"
              />
              <button
                type="submit"
                className="bg-[#C48F65] text-white p-3 rounded-full hover:bg-[#A77250] transition flex items-center justify-center shadow"
              >
                <FaPaperPlane size={14} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Sidebar Activity Tracker */}
      <div className="w-1/4 bg-white shadow-lg p-4 flex flex-col items-center fixed right-0 top-0 bottom-0 overflow-y-auto">
        <h3 className="text-xl font-bold text-[#5A4230] mb-4 mt-4">Activity Tracker</h3>
        {metricsConfig.map(({ label, key, unit }) => (
          <div key={label} className="w-full mb-4 p-4 bg-[#F9EDE1] rounded-lg shadow">
            <h4 className="text-lg font-semibold text-[#5A4230]">{label}</h4>
            <p className="text-gray-700">
              {activityData[key]} {unit}
            </p>
            <button
              onClick={() => openModal(label)}
              className="mt-2 bg-[#C48F65] text-white px-3 py-1 rounded-md hover:bg-[#A77250] transition"
            >
              Update
            </button>
          </div>
        ))}
      </div>

      {/* Metric Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold text-[#5A4230]">Update {selectedMetric}</h3>
            <input
              type="number"
              placeholder={`Enter ${selectedMetric}`}
              className="mt-3 w-full p-2 border border-gray-300 rounded-md"
              value={updatedValue}
              onChange={(e) => setUpdatedValue(e.target.value)}
            />
            <div className="flex justify-between mt-4">
              <button 
                onClick={closeModal} 
                className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateActivity} 
                className="bg-[#C48F65] text-white px-3 py-1 rounded-md hover:bg-[#A77250] transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};