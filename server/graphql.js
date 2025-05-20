const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");
const { User, Task, Project, Message } = require("./models"); // <-- Add Message
const mongoose = require("mongoose");

// graphql.js - أضف هذا إلى الملف الموجود

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// مفتاح سري للتوقيع JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// أضف هذه الأنواع إلى مخطط GraphQL الخاص بك
const authTypeDefs = `
  type User {
    id: ID!
    username: String!
    role: String!
    universityID: String
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  extend type Query {
    me: User
  }

  extend type Mutation {
    login(username: String!, password: String!): AuthPayload
    signup(username: String!, password: String!, universityID: String): AuthPayload
  }
`;

// أضف هذه الحلالات إلى حلالات GraphQL الخاصة بك
const authResolvers = {
  Query: {
    me: async (_, __, { req }) => {
      // تحقق من وجود المستخدم في الطلب (يتم إضافته بواسطة middleware)
      if (!req.user) {
        return null;
      }

      // ابحث عن المستخدم في قاعدة البيانات
      const user = await User.findById(req.user.id).select('-password');
      return {
        id: user._id,
        username: user.username,
        role: user.role,
        universityID: user.universityID
      };
    }
  },
  Mutation: {
    signup: async (_, { username, password, universityID }) => {
      // التحقق من وجود المستخدم
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        throw new Error('Username already exists');
      }

      // تشفير كلمة المرور
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // إنشاء مستخدم جديد
      const newUser = new User({
        username,
        password: hashedPassword,
        role: universityID ? 'student' : 'admin',
        universityID: universityID || null,
      });

      await newUser.save();

      // إنشاء توكن JWT
      const token = jwt.sign(
        { id: newUser._id, username: newUser.username, role: newUser.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return {
        token,
        user: {
          id: newUser._id,
          username: newUser.username,
          role: newUser.role,
          universityID: newUser.universityID,
        },
      };
    },
    login: async (_, { username, password }) => {
      // التحقق من وجود المستخدم
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // التحقق من كلمة المرور
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // إنشاء توكن JWT
      const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return {
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
          universityID: user.universityID,
        },
      };
    }
  }
};

// دمج مخططات وحلالات المصادقة مع المخططات والحلالات الموجودة
// تأكد من تعديل هذا الجزء بناءً على كيفية تعريف المخططات والحلالات في ملفك
const typeDefs = [
  // المخططات الموجودة
  // ...
  authTypeDefs
];

const resolvers = {
  Query: {
    // الحلالات الموجودة
    // ...
    ...authResolvers.Query
  },
  Mutation: {
    // الحلالات الموجودة
    // ...
    ...authResolvers.Mutation
  }
};


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
            return await User.findById(new mongoose.Types.ObjectId(parent.assignedTo));
          }
          // إذا لم يكن معرف صالح، ابحث عن المستخدم بطريقة أخرى
          // مثلاً بالاسم أو أي حقل آخر
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
          // محاولة تحويل المعرف إلى ObjectId إذا كان ممكنًا
          if (mongoose.Types.ObjectId.isValid(parent.assignedBy)) {
            return await User.findById(new mongoose.Types.ObjectId(parent.assignedBy));
          }
          // إذا لم يكن معرف صالح، ابحث عن المستخدم بطريقة أخرى
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
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: new GraphQLObjectType({
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
         // استخدام المعرفات كما هي بدون تحويل
          //console.log("Task data:", args);
           const taskData = { ...args };
    
            // تحويل التاريخ إلى كائن Date
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
        resolve(_, args) {
          // Convertir IDs de string a ObjectId
          const projectData = { ...args };
          
          if (args.createdBy && mongoose.Types.ObjectId.isValid(args.createdBy)) {
            projectData.createdBy = new mongoose.Types.ObjectId(args.createdBy);
          }
          
          if (args.students && args.students.length > 0) {
            projectData.students = args.students
              .filter(id => mongoose.Types.ObjectId.isValid(id))
              .map(id => new mongoose.Types.ObjectId(id));
          }
          
          const project = new Project(projectData);
          return project.save();
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
          // Convertir IDs de string a ObjectId
          const updateData = { ...args };
          delete updateData.id; // Eliminar el ID del objeto de actualización
          
          if (args.assignedTo && mongoose.Types.ObjectId.isValid(args.assignedTo)) {
            updateData.assignedTo = new mongoose.Types.ObjectId(args.assignedTo);
          }
          
          if (args.assignedBy && mongoose.Types.ObjectId.isValid(args.assignedBy)) {
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
    },
  }),
});
