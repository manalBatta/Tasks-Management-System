const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student',
  },
  universityID: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const taskSchema = new mongoose.Schema({

  title: String,
  description: String,
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "On Hold", "Cancelled"],
    default: "Pending",
  },
  projectId: String,
  projectName: String,
  assignedTo:String ,
  assignedBy: String ,
  createdAt: { 
    type: Date, 
    default: Date.now,
    get: function(date) {
      return date ? date.toISOString() : null;
    }
  },
  dueDate: { 
    type: Date,
    get: function(date) {
      return date ? date.toISOString().split('T')[0] : null;
    }
  },
});

// تحويل التاريخ إلى كائن Date قبل الحفظ
taskSchema.pre('save', function(next) {
  if (this.dueDate && typeof this.dueDate === 'string') {
    try {
      this.dueDate = new Date(this.dueDate);
    } catch (e) {
      console.error("Error converting dueDate to Date:", e);
    }
  }
  next();
});
// إضافة getters
taskSchema.set('toJSON', { getters: true });
taskSchema.set('toObject', { getters: true });

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

const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
const Task = mongoose.model("Task", taskSchema);
const Project = mongoose.model("Project", projectSchema);
const Message = mongoose.model("Message", messageSchema);

module.exports = { User, Task, Project, Message };