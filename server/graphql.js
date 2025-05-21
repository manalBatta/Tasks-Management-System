const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLBoolean,
} = require("graphql");
const { User, Task, Project, Message } = require("./models"); // <-- Add Message
const mongoose = require("mongoose");


const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";



// UserType
const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    username: { type: GraphQLString },
    password: { type: GraphQLString }, // Usually you don't expose password, but included for schema match
    role: { type: GraphQLString },
    universityID: { type: GraphQLString },
  }),
});

// ProjectType
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    createdBy: {
      type: UserType,
      async resolve(parent) {
        return await User.findById(parent.createdBy);
      },
    },
    startDate: { type: GraphQLString },
    endDate: { type: GraphQLString },
    status: { type: GraphQLString },
    category: { type: GraphQLString },
    students: {
      type: new GraphQLList(UserType),
      async resolve(parent) {
        return await User.find({ _id: { $in: parent.students } });
      },
    },
    tasks: {
      // Correct type: GraphQLList of TaskType
      type: new GraphQLList(TaskType),
      async resolve(parent) {
        return await Task.find({ projectId: parent.id });
      },
    },
  }),
});

// TaskType
const TaskType = new GraphQLObjectType({
  name: "Task",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    projectId: { type: GraphQLID },
    projectName: { type: GraphQLString },
    assignedTo: {
      type: UserType,
      async resolve(parent) {
        try {
          // محاولة تحويل المعرف إلى ObjectId إذا كان ممكنًا
          if (mongoose.Types.ObjectId.isValid(parent.assignedTo)) {
            return await User.findById(
              new mongoose.Types.ObjectId(parent.assignedTo)
            );
          }
          
          return null;
        } catch (error) {
          console.error("Error finding assignedTo user:", error);
          return null;
        }
      },
    },
    assignedBy: {
      type: UserType,
      async resolve(parent) {
        try {
          if (mongoose.Types.ObjectId.isValid(parent.assignedBy)) {
            return await User.findById(
              new mongoose.Types.ObjectId(parent.assignedBy)
            );
          }
          return null;
        } catch (error) {
          console.error("Error finding assignedBy user:", error);
          return null;
        }
      },
    },
    createdAt: { type: GraphQLString },
    dueDate: { type: GraphQLString },
  }),
});

// MessageType
const MessageType = new GraphQLObjectType({
  name: "Message",
  fields: () => ({
    id: { type: GraphQLID },
    senderId: { type: GraphQLString },
    receiverId: { type: GraphQLString },
    message: { type: GraphQLString },
    timestamp: { type: GraphQLString },
  }),
});

const DashboardStatsType = new GraphQLObjectType({
  name: "DashboardStats",
  fields: () => ({
    projectsCount: { type: GraphQLInt },
    studentsCount: { type: GraphQLInt },
    tasksCount: { type: GraphQLInt },
    finishedProjectsCount: { type: GraphQLInt },
  }),
});

// Root Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    tasks: {
      type: new GraphQLList(TaskType),
      resolve() {
        return Task.find();
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve() {
        return User.find();
      },
    },
    projects: {
      type: new GraphQLList(ProjectType),
      resolve() {
        return Project.find();
      },
    },
    messages: {
      type: new GraphQLList(MessageType),
      args: {
        senderId: { type: GraphQLString },
        receiverId: { type: GraphQLString },
      },
      async resolve(_, args) {
        // Fetch messages between two users (both directions)
        if (args.senderId && args.receiverId) {
          return Message.find({
            $or: [
              { senderId: args.senderId, receiverId: args.receiverId },
              { senderId: args.receiverId, receiverId: args.senderId },
            ],
          }).sort({ timestamp: 1 });
        }
        return Message.find().sort({ timestamp: 1 });
      },
    },
    task: {
      type: TaskType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return Task.findById(args.id);
      },
    },
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return User.findById(args.id);
      },
    },
    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      resolve(_, args) {
        return Project.findById(args.id);
      },
    },
    tasksByProject: {
      type: new GraphQLList(TaskType),
      args: { projectId: { type: GraphQLID } },
      resolve(_, args) {
        return Task.find({ projectId: args.projectId });
      },
    },
    dashboardStats: {
      type: DashboardStatsType,
      async resolve() {
        const projectsCount = await Project.countDocuments();
        const studentsCount = await User.countDocuments({ role: "student" });
        const tasksCount = await Task.countDocuments();
        const finishedProjectsCount = await Project.countDocuments({
          status: "Completed",
        });

        return {
          projectsCount,
          studentsCount,
          tasksCount,
          finishedProjectsCount,
        };
      },
    },
    verifyToken: {
      type: UserType,
      resolve: async (_, __, context) => {
        const req = context.req;
        const token =
          req && (req.headers["x-auth-token"] || req.header("x-auth-token"));
        if (!token) return null;
        try {
          const decoded = jwt.verify(token, JWT_SECRET);
          const user = await User.findById(decoded.id);
          if (!user) return null;
          return {
            id: user._id,
            username: user.username,
            role: user.role,
            universityID: user.universityID,
          };
        } catch (err) {
          return null;
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addTask: {
      type: TaskType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        dueDate: { type: GraphQLString },
        assignedTo: { type: GraphQLID },
        assignedBy: { type: GraphQLID },
        projectId: { type: GraphQLID },
        projectName: { type: GraphQLString },
      },
      async resolve(_, args) {
       
        const taskData = { ...args };

        if (args.dueDate) {
          taskData.dueDate = new Date(args.dueDate);
        }
        const task = new Task(args);
        return task.save();
      },
    },
    addUser: {
      type: UserType,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        role: { type: GraphQLString },
        universityID: { type: GraphQLString },
      },
      resolve(_, args) {
        const user = new User(args);
        return user.save();
      },
    },
    addProject: {
      type: ProjectType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLString },
        createdBy: { type: GraphQLID },
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString },
        status: { type: GraphQLString },
        category: { type: GraphQLString },
        students: { type: new GraphQLList(GraphQLID) },
      },
      async resolve(_, args) {
        try {
          // Create project data object
          const projectData = {
            title: args.title,
            description: args.description || "",
            // Don't include createdBy yet
            startDate: args.startDate ? new Date(args.startDate) : new Date(),
            endDate: args.endDate ? new Date(args.endDate) : null,
            status: args.status || "Pending",
            category: args.category || "Others",
          };

          if (
            args.createdBy &&
            mongoose.Types.ObjectId.isValid(args.createdBy)
          ) {
            projectData.createdBy = new mongoose.Types.ObjectId(args.createdBy);
          }

          // Handle students array - filter out invalid ObjectIds
          if (args.students && args.students.length > 0) {
            projectData.students = args.students
              .filter((id) => mongoose.Types.ObjectId.isValid(id))
              .map((id) => new mongoose.Types.ObjectId(id));
          } else {
            projectData.students = [];
          }


          // Create and save the project
          const project = new Project(projectData);
          const savedProject = await project.save();

          return savedProject;
        } catch (error) {
          console.error("Error adding project:", error);
          throw new Error(`Failed to add project: ${error.message}`);
        }
      },
    },

    updateTask: {
      type: TaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        description: { type: GraphQLString },
        status: { type: GraphQLString },
        dueDate: { type: GraphQLString },
        assignedTo: { type: GraphQLID },
        assignedBy: { type: GraphQLID },
      },
      async resolve(_, args) {
        const updateData = { ...args };
        delete updateData.id;

        if (
          args.assignedTo &&
          mongoose.Types.ObjectId.isValid(args.assignedTo)
        ) {
          updateData.assignedTo = new mongoose.Types.ObjectId(args.assignedTo);
        }

        if (
          args.assignedBy &&
          mongoose.Types.ObjectId.isValid(args.assignedBy)
        ) {
          updateData.assignedBy = new mongoose.Types.ObjectId(args.assignedBy);
        }

        return Task.findByIdAndUpdate(args.id, updateData, { new: true });
      },
    },
    updateTaskStatus: {
      type: TaskType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        status: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { id, status }) {
        return Task.findByIdAndUpdate(id, { status }, { new: true });
      },
    },
    signup: {
      type: UserType,
      args: {
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        universityID: { type: GraphQLString },
      },
      async resolve(_, { username, password, universityID }) {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error("Username already exists");
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
          username,
          password: hashedPassword,
          role: universityID ? "student" : "admin",
          universityID: universityID || null,
        });
        await newUser.save();
        return newUser;
      },
    },

    login: {
      type: new GraphQLObjectType({
        name: "LoginResponse",
        fields: {
          token: { type: GraphQLString },
          user: { type: UserType },
        },
      }),
      args: {
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
      },
      async resolve(_, { username, password }) {
        const user = await User.findOne({ username });
        if (!user) {
          throw new Error("Invalid credentials");
        }
        const isMatch = password == user.password;
        if (!isMatch) {
          throw new Error("Invalid credentials");
        }
        const token = jwt.sign(
          { id: user._id, username: user.username, role: user.role },
          JWT_SECRET,
          { expiresIn: "1d" }
        );
        return {
          token,
          user,
        };
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
