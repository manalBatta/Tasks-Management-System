const mongoose = require("mongoose");
const { User, Project, Task, Message } = require("./models");

const mongoURI = "mongodb://localhost:27017/taskmanager";

const seed = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Message.deleteMany({});

    // Users
    const users = [
      {
        username: "adminUser",
        password: "123",
        role: "admin",
        universityID: null,
      },
      {
        username: "AliYaseen",
        password: "123",
        role: "student",
        universityID: "UNI12345",
      },
      {
        username: "BraaAeesh",
        password: "hashedpassword3",
        role: "student",
        universityID: "UNI67890",
      },
      {
        username: "IbnAlJawzee",
        password: "hashedpassword4",
        role: "student",
        universityID: "UNI11111",
      },
      {
        username: "IbnMalik",
        password: "hashedpassword5",
        role: "student",
        universityID: "UNI22222",
      },
      {
        username: "AymanOutom",
        password: "hashedpassword6",
        role: "student",
        universityID: "UNI33333",
      },
      {
        username: "SalahSalah",
        password: "hashedpassword7",
        role: "student",
        universityID: "UNI44444",
      },
      {
        username: "YahyaLeader",
        password: "hashedpassword8",
        role: "student",
        universityID: "UNI55555",
      },
      {
        username: "SalamKareem",
        password: "hashedpassword9",
        role: "student",
        universityID: "UNI66666",
      },
      {
        username: "IsaacNasir",
        password: "hashedpassword10",
        role: "student",
        universityID: "UNI77777",
      },
      {
        username: "SaeedSalam",
        password: "hashedpassword11",
        role: "student",
        universityID: "UNI88888",
      },
    ];
    const createdUsers = await User.insertMany(users);

    // Helper to get user _id by username
    const getUserId = (username) =>
      createdUsers.find((u) => u.username === username)._id;

    // Projects
    const projects = [
      {
        title: "Website Redesign",
        description:
          " Redesign the company website to improve user experience.",
        createdBy: getUserId("adminUser"),
        startDate: "2024-01-01",
        endDate: "2024-06-21",
        status: "In Progress",
        category: "Mobile Development",
        students: [
          getUserId("SalahSalah"),
          getUserId("IsaacNasir"),
          getUserId("AliYaseen"),
        ],
      },
      {
        title: "Mobile App Development",
        description: "Develop a mobile application for our services.",
        createdBy: getUserId("adminUser"),
        startDate: "2024-02-15",
        endDate: "2024-08-15",
        status: "Completed",
        category: "Mobile Development",
        students: [getUserId("AliYaseen"), getUserId("BraaAeesh")],
      },
      {
        title: "Data Analysis Project",
        description: "Analyze data from the last quarter to find insights.",
        createdBy: getUserId("adminUser"),
        startDate: "2024-03-01",
        endDate: "2024-05-01",
        status: "Pending",
        category: "Data Science",
        students: [getUserId("IbnAlJawzee"), getUserId("YahyaLeader")],
      },
    ];
    const createdProjects = await Project.insertMany(projects);

    // Tasks
     // Tasks
     // Tasks
    const tasks = [
      {
        title: "Data Collection",
        description: "Gather historical weather data.",
        status: "Pending",
        assignedTo: getUserId("SalahSalah"),
        assignedBy: getUserId("adminUser"),
        createdAt: "2024-02-26T12:00:00Z",
        dueDate: "2025-05-30",
        projectId: getProjectId("Website Redesign"), 
        projectName:"Website Redesign",
      },
      {
        title: "UI Design",
        description: "Create a responsive UI for the web app.",
        status: "In Progress",
        assignedTo: getUserId("IsaacNasir"),
        assignedBy: getUserId("adminUser"),
        createdAt: "2024-02-26T12:30:00Z",
        dueDate: "2025-05-30",
        projectId: getProjectId("Website Redesign"), 
        projectName:"Website Redesign",

      },
          {
        title: "Develo Mobiles",
        description: "Think how mobiles can be develop",
        status: "Pending",
        assignedTo: getUserId("AliYaseen"),
        assignedBy: getUserId("adminUser"),
        createdAt: "2024-02-26T12:00:00Z",
        dueDate: "2025-05-30",
        projectId: getProjectId("Mobile App Development"), 
        projectName:"Mobile App Development",

      },
    ];
    await Task.insertMany(tasks);
    
    // Messages (chat)
    const messages = [
      {
        senderId: getUserId("AliYaseen").toString(),
        receiverId: getUserId("BraaAeesh").toString(),
        message: "Hey, have you started working on the UI?",
        timestamp: "2024-02-26T13:00:00Z",
      },
      {
        senderId: getUserId("BraaAeesh").toString(),
        receiverId: getUserId("AliYaseen").toString(),
        message: "Yes, I’m working on the color scheme now.",
        timestamp: "2024-02-26T13:05:00Z",
      },
      {
        senderId: getUserId("adminUser").toString(),
        receiverId: getUserId("AliYaseen").toString(),
        message: "Ali, please update me on the data collection progress.",
        timestamp: "2024-02-26T14:00:00Z",
      },
      {
        senderId: getUserId("AliYaseen").toString(),
        receiverId: getUserId("adminUser").toString(),
        message:
          "Sure! I have gathered 60% of the required data. I should be done by tomorrow.",
        timestamp: "2024-02-26T14:10:00Z",
      },
      {
        senderId: getUserId("adminUser").toString(),
        receiverId: getUserId("AliYaseen").toString(),
        message: "Great work! Let me know if you need any help.",
        timestamp: "2024-02-26T14:15:00Z",
      },
    ];
    await Message.insertMany(messages);

    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seed();
