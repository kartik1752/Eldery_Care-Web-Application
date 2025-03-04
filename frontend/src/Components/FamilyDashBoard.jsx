import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaTasks, FaSignOutAlt } from "react-icons/fa";
import { MdAssignmentAdd } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

export const FamilyDashBoard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { name, email } = location.state || {};

  const [elders, setElders] = useState([]);
  const [selectedElder, setSelectedElder] = useState("");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/elder/getElders`)
      .then((res) => res.json())
      .then((data) => setElders(data))
      .catch((error) => console.error("Error fetching elders:", error));
  }, []);

  useEffect(() => {
    if (!selectedElder) return;
    const elder = elders.find((e) => e.name === selectedElder);
    if (!elder) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/elder/getTasks?email=${elder.email}`)
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks || []))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, [selectedElder, elders]);

  const handleAddTask = async () => {
    if (!selectedElder || !task) return;
    const elder = elders.find((e) => e.name === selectedElder);
    if (!elder) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/elder/addTask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: elder.email, task, status: "Pending" }),
      });

      if (response.ok) {
        setTask("");
        setTasks([...tasks, { task, status: "Pending" }]);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9EDE1] flex flex-col items-center p-4">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-lg p-6">
        <nav className="flex flex-col sm:flex-row justify-between items-center border-b pb-4">
          <div className="flex items-center gap-4">
            <img
              src="https://media.istockphoto.com/id/614314636/photo/complete-redhead-family.jpg?s=612x612&w=0&k=20&c=gkELO85KLecQxgS3wL95F0SiielAg9Y3SfKLMjVVkt0="
              alt="Profile"
              className="w-12 h-12 rounded-full border"
            />
            <div className="min-w-0">
              <h2 className="text-xl font-bold text-[#5A4230] truncate">{name}</h2>
              <p className="text-gray-600 text-sm truncate">{email}</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/signup")}
            className="mt-4 sm:mt-0 flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 w-full sm:w-auto transition"
          >
            <FaSignOutAlt className="mr-2" /> Logout
          </button>
        </nav>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-[#5A4230]">
            Assign a Task to Your Elder
          </h3>
          <div className="mt-4 flex flex-col sm:flex-row gap-4">
            <select
              value={selectedElder}
              onChange={(e) => setSelectedElder(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full sm:w-1/2"
            >
              <option value="">Choose an elder</option>
              {elders.map((elder) => (
                <option key={elder._id} value={elder.name}>
                  {elder.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="border px-3 py-2 rounded-lg w-full sm:w-1/2"
              placeholder="Enter task..."
            />
            <button
              onClick={handleAddTask}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition w-full sm:w-auto flex justify-center"
            >
              <MdAssignmentAdd size={24} />
            </button>
          </div>
        </div>

        {selectedElder && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-[#5A4230]">
              Tasks for {selectedElder}
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4">
              <AnimatePresence>
                {tasks.length > 0 ? (
                  tasks.map((t, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center bg-gray-100 p-4 shadow-md rounded-lg w-full"
                    >
                      <FaTasks className="text-blue-500 mr-3" size={20} />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-md font-bold text-[#5A4230] truncate">
                          {t.task}
                        </h4>
                        <p className="text-gray-700 text-sm">
                          Status: {t.status}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-600"
                  >
                    No tasks assigned yet.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
