import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./pages/Dashboard";
import AuthForm from "./pages/AuthForm";

function App() {
  const { user } = useAuth();

  //initializing local storage with mock data
  useEffect(() => {
    const mockData = {
      student_projects: [
        { studentId: 7, projectId: 1 },
        { studentId: 10, projectId: 1 },
        { studentId: 10, projectId: 2 },
        { studentId: 11, projectId: 3 },
        { studentId: 8, projectId: 3 },
        { studentId: 2, projectId: 1 },
        { studentId: 2, projectId: 2 },
        { studentId: 3, projectId: 2 },
      ],
      users: [
        {
          id: 1,
          username: "adminUser",
          password: "123",
          role: "admin",
          universityID: null,
        },
        {
          id: 2,
          username: "AliYaseen",
          password: "123",
          role: "student",
          universityID: "UNI12345",
        },
        {
          id: 3,
          username: "BraaAeesh",
          password: "hashedpassword3",
          role: "student",
          universityID: "UNI67890",
        },
        {
          id: 4,
          username: "IbnAlJawzee",
          password: "hashedpassword4",
          role: "student",
          universityID: "UNI11111",
        },
        {
          id: 5,
          username: "IbnMalik",
          password: "hashedpassword5",
          role: "student",
          universityID: "UNI22222",
        },
        {
          id: 6,
          username: "AymanOutom",
          password: "hashedpassword6",
          role: "student",
          universityID: "UNI33333",
        },
        {
          id: 7,
          username: "SalahSalah",
          password: "hashedpassword7",
          role: "student",
          universityID: "UNI44444",
        },
        {
          id: 8,
          username: "YahyaLeader",
          password: "hashedpassword8",
          role: "student",
          universityID: "UNI55555",
        },
        {
          id: 9,
          username: "SalamKareem",
          password: "hashedpassword9",
          role: "student",
          universityID: "UNI66666",
        },
        {
          id: 10,
          username: "IsaacNasir",
          password: "hashedpassword10",
          role: "student",
          universityID: "UNI77777",
        },
        {
          id: 11,
          username: "SaeedSalam",
          password: "hashedpassword11",
          role: "student",
          universityID: "UNI88888",
        },
      ],
      projects: [
        {
          id: 1,
          title: "Website Redesign",
          description:
            " Redesign the company website to improve user experience.",
          createdBy: 1,
          startDate: "2024-01-01",
          endDate: "2024-06-21",
          status: "InProgress",
          category: "Mobile Development",
        },
        {
          id: 2,
          title: "Mobile App Development",
          description: "Develop a mobile application for our services.",
          createdBy: 1,
          startDate: "2024-02-15",
          endDate: "2024-08-15",
          status: "Completed",
          category: "Mobile Development",
        },

        {
          id: 3,
          title: "Data Analysis Project",
          description: "Analyze data from the last quarter to find insights.",
          createdBy: 1,
          startDate: "2024-03-01",
          endDate: "2024-05-01",
          status: "Pending",
          category: "Data Science",
        },
      ],
      tasks: [
        {
          id: 1,
          title: "Data Collection",
          description: "Gather historical weather data.",
          status: "Pending",
          assignedTo: 7,
          assignedBy: 1,
          projectId: 1,
          createdAt: "2024-02-26T12:00:00Z",
          dueDate: "2025-05-30",
        },
        {
          id: 2,
          title: "UI Design",
          description: "Create a responsive UI for the web app.",
          status: "In Progress",
          assignedTo: 10,
          assignedBy: 1,
          projectId: 1,
          projectTitle: "Web App Development",
          createdAt: "2024-02-26T12:30:00Z",
          dueDate: "2025-05-30",
        },
      ],
      chat: [
        {
          id: 1,
          senderId: 2,
          receiverId: 3,
          message: "Hey, have you started working on the UI?",
          timestamp: "2024-02-26T13:00:00Z",
        },
        {
          id: 2,
          senderId: 3,
          receiverId: 2,
          message: "Yes, I’m working on the color scheme now.",
          timestamp: "2024-02-26T13:05:00Z",
        },
        {
          id: 3,
          senderId: 1,
          receiverId: 2,
          message: "Ali, please update me on the data collection progress.",
          timestamp: "2024-02-26T14:00:00Z",
        },
        {
          id: 4,
          senderId: 2,
          receiverId: 1,
          message:
            "Sure! I have gathered 60% of the required data. I should be done by tomorrow.",
          timestamp: "2024-02-26T14:10:00Z",
        },
        {
          id: 5,
          senderId: 1,
          receiverId: 2,
          message: "Great work! Let me know if you need any help.",
          timestamp: "2024-02-26T14:15:00Z",
        },
      ],
    };

    if (localStorage.getItem("data") === null) {
      localStorage.setItem("data", JSON.stringify(mockData));
    }
  }, []);

  return <>{user ? <Dashboard /> : <AuthForm />}</>;
}

export default App;
