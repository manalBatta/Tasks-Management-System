const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLID,
  GraphQLNonNull,
} = require("graphql");
const { User, Task, Project, Message } = require("./models"); // <-- Add Message

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
    assignedTo: {
      type: UserType,
      async resolve(parent) {
        return await User.findById(parent.assignedTo);
      },
    },
    assignedBy: {
      type: UserType,
      async resolve(parent) {
        return await User.findById(parent.assignedBy);
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
        },
        resolve(_, args) {
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
          const project = new Project(args);
          return project.save();
        },
      },
    },
  }),
});
