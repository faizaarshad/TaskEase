import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { getAuth, signOut } from "firebase/auth";
import "./TaskManager.css";
import AOS from 'aos';
import 'aos/dist/aos.css';

// ✅ Import Images (Ensure they are inside `src/assets/`)
import heroImage from "./assets/hero-bg.jpg";
import taskManagementImg from "./assets/task-management.jpg";
import workflowImg from "./assets/workflow.jpg";
import collaborationImg from "./assets/collaboration.jpg";

export default function TaskManager() {
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);
  const [task, setTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [tasks, setTasks] = useState([]);
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    document.body.classList.toggle("dark-mode", darkMode);
    if (user) fetchTasks();
  }, [user, darkMode]);

  // 🔹 Toggle Dark Mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.body.classList.toggle("dark-mode", newMode);
  };

  // 🔹 Logout Function
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setTasks([]);
  };

  // 🔹 Fetch Tasks
  const fetchTasks = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    setTasks(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  // 🔹 Add Task
  const addTask = async () => {
    if (task.trim()) {
      try {
        await addDoc(collection(db, "tasks"), {
          name: task,
          priority: priority,
          dueDate: dueDate,
          completed: false,
          progress: 0,
        });
        setTask("");
        setDueDate("");
        fetchTasks();
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  // 🔹 Update Task Progress
  const updateTaskProgress = async (id, progressValue) => {
    await updateDoc(doc(db, "tasks", id), { progress: progressValue });
    fetchTasks();
  };

  // 🔹 Delete Task with Confirmation
  const deleteTask = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteDoc(doc(db, "tasks", id));
      fetchTasks();
    }
  };

  // 🔹 Edit Task
  const startEditing = (task) => {
    setEditingTaskId(task.id);
    setTask(task.name);
    setPriority(task.priority);
    setDueDate(task.dueDate);
    setProgress(task.progress);
  };

  const saveEditedTask = async () => {
    if (editingTaskId) {
      await updateDoc(doc(db, "tasks", editingTaskId), {
        name: task,
        priority: priority,
        dueDate: dueDate,
        progress: progress,
      });
      setEditingTaskId(null);
      setTask("");
      setDueDate("");
      fetchTasks();
    }
  };

  return (
    <div className={`website-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      {/* Navbar */}
      <nav className="navbar">
        <h2>TaskEase</h2>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#task-section">Tasks</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
        {user && <button onClick={handleLogout} className="logout-btn">Logout</button>}
        <button onClick={toggleDarkMode} className="mode-btn">
          {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
        </button>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero" style={{ backgroundImage: `url(${heroImage})` }} data-aos="fade-up">
        <div className="hero-content">
          <h1>Boost Your Productivity with TaskEase</h1>
          <p>Organize tasks effortlessly and stay ahead.</p>
          <button onClick={() => document.getElementById("task-section").scrollIntoView({ behavior: "smooth" })}>
            Get Started
          </button>
        </div>
      </section>

      {/* Task Manager Section */}
      <section id="task-section" className="task-manager" data-aos="fade-up">
        <h1 className="center-text">Manage Your Tasks</h1>
        <div className="input-container">
          <label>Task</label>
          <input type="text" placeholder="Enter task" value={task} onChange={(e) => setTask(e.target.value)} />

          <label>Due Date</label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="High">🔥 High Priority</option>
            <option value="Medium">⚡ Medium Priority</option>
            <option value="Low">🟢 Low Priority</option>
          </select>

          {editingTaskId ? (
            <button onClick={saveEditedTask} className="edit-btn">💾 Save</button>
          ) : (
            <button onClick={addTask} className="add-btn">➕ Add Task</button>
          )}
        </div>

        <ul>
          {tasks.map((t) => (
            <li key={t.id} className="task-item">
              <span>{t.name} ({t.priority}) - Due: {t.dueDate || "No Date"} - Progress: {t.progress}%</span>
              <input type="range" min="0" max="100" value={t.progress} onChange={(e) => updateTaskProgress(t.id, e.target.value)} />
              <button onClick={() => startEditing(t)} className="edit-btn">✏️</button>
              <button onClick={() => deleteTask(t.id)} className="delete-btn">❌</button>
            </li>
          ))}
        </ul>
      </section>




      {/* 🔹 Features Section (RESTORED) */}
      <section id="features" className="features" data-aos="fade-up">
        <h2 className="center-text">Why Choose TaskEase?</h2>
        <div className="feature-container">
          <div className="feature-box">
            <img src={taskManagementImg} alt="Task Management" />
            <h3>Task Management</h3>
            <p>Stay organized with a simple, intuitive interface for creating, updating, and completing tasks seamlessly.</p>
          </div>
          <div className="feature-box">
            <img src={workflowImg} alt="Workflow" />
            <h3>Enhanced Productivity</h3>
            <p>Enjoy a distraction-free workflow with smooth animations, dark mode, and an engaging UI.</p>
          </div>
          <div className="feature-box">
            <img src={collaborationImg} alt="Collaboration" />
            <h3>Smart Collaboration</h3>
            <p>Assign tasks, set priorities, and track progress efficiently—whether solo or in a team.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="footer">
        <p>© 2025 TaskEase. All rights reserved.</p>
        <p>Contact us: <a href="mailto:support@taskease.com">support@taskease.com</a></p>
      </footer>

      
    </div>
  );
}
