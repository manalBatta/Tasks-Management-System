const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, enum: ["student", "admin"], default: "student" },
  universityID: String,
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "On Hold", "Cancelled"],
    default: "Pending",
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },

  dueDate: Date,
});

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  startDate: Date,
  endDate: Date,
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending",
  },
  category: String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);
const Project = mongoose.model("Project", projectSchema);

module.exports = { User, Task, Project };
