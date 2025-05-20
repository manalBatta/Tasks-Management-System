import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import "../index.css";

const Tasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]); // State to store tasks
  const [users, setUsers] = useState([]); // State to store users
  const [projects, setProjects] = useState([]); // State to store projects
  const [loading, setLoading] = useState(true); // Loading state
  const { user } = useAuth();
  const tableRef = useRef(null); // Create a ref for the table

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Fetch users from backend
  async function fetchUsers() {
    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              users {
                id
                username
                role
                universityID
              }
            }
          `,
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      const { data } = await response.json();
      setUsers(data.users);
      return data.users;
    } catch (err) {
      alert("Error fetching users: " + err.message);
      console.error("Error fetching users:", err);
      return [];
    }
  }

  // Fetch projects from backend
  async function fetchProjects() {
    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              projects {
                id
                title
                description
                status
                category
              }
            }
          `,
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch projects");
      const { data } = await response.json();
      setProjects(data.projects);
      return data.projects;
    } catch (err) {
      alert("Error fetching projects: " + err.message);
      console.error("Error fetching projects:", err);
      return [];
    }
  }

  // Fetch tasks from backend
  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              tasks {
                id
                title
                description
                status
                projectId
                projectName
                createdAt
                dueDate
                assignedTo {
                  id
                  username
                }
                assignedBy {
                  id
                  username
                }
              }
            }
          `,
        }),
      });
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const { data } = await response.json();
      // طباعة البيانات الأصلية للتشخيص
      console.log("Original tasks data:", data.tasks);
      // معالجة التواريخ بطريقة آمنة
      const processedTasks = data.tasks.map((task) => {
        // نسخة من المهمة
        const processedTask = { ...task };

        // معالجة تاريخ الاستحقاق
        try {
          if (task.dueDate) {
            // محاولة تحويل التاريخ إلى كائن Date
            const dueDate = new Date(task.dueDate);
            // التحقق من صحة التاريخ
            if (!isNaN(dueDate.getTime())) {
              processedTask.dueDate = dueDate.toISOString().split("T")[0]; // تنسيق YYYY-MM-DD
            } else {
              processedTask.dueDate = null;
            }
          } else {
            processedTask.dueDate = null;
          }
        } catch (e) {
          console.error("Error processing dueDate:", e);
          processedTask.dueDate = null;
        }

        // معالجة تاريخ الإنشاء
        try {
          if (task.createdAt) {
            // محاولة تحويل التاريخ إلى كائن Date
            const createdAt = new Date(task.createdAt);
            // التحقق من صحة التاريخ
            if (!isNaN(createdAt.getTime())) {
              processedTask.createdAt = createdAt.toISOString();
            } else {
              processedTask.createdAt = new Date().toISOString();
            }
          } else {
            processedTask.createdAt = new Date().toISOString();
          }
        } catch (e) {
          console.error("Error processing createdAt:", e);
          processedTask.createdAt = new Date().toISOString();
        }

        return processedTask;
      });

      // تصفية المهام إذا كان المستخدم طالبًا
      let filteredTasks = processedTasks;
      if (user.role === "student") {
        filteredTasks = filteredTasks.filter(
          (task) => task.assignedTo && task.assignedTo.id === user.id
        );
      }

      setTasks(filteredTasks);
      return filteredTasks;
    } catch (err) {
      alert("Error fetching tasks: " + err.message);
      console.error("Error fetching tasks:", err);
      return [];
    }
  }

  // Add a new task
  const addTask = async (event) => {
    event.preventDefault();

    // Get form values
    const projectTitle = event.target.elements["project-title"].value;
    const taskName = event.target.elements["task-name"].value;
    const description = event.target.elements["description"].value;
    const assignedStudent = event.target.elements["assigned-student"].value;
    const status = event.target.elements["status"].value;
    const dueDate = event.target.elements["due-date"].value;

    // Validation
    if (
      !projectTitle ||
      !taskName ||
      !description ||
      !assignedStudent ||
      !status ||
      !dueDate
    ) {
      alert("Please fill in all fields.");
      return;
    }

    if (dueDate < new Date().toISOString().split("T")[0]) {
      alert("Due date cannot be in the past.");
      return;
    }

    // Find project and user IDs
    const project = projects.find((proj) => proj.title === projectTitle);
    const projectId = project ? project.id : null;

    const assignedUser = users.find((u) => u.username === assignedStudent);
    const assignedToId = assignedUser ? assignedUser.id : null;

    if (!projectId || !assignedToId) {
      alert("Project or assigned user not found.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation AddTask(
              $title: String!
              $description: String
              $status: String
              $dueDate: String
              $assignedTo: ID
              $assignedBy: ID
              $projectId: ID
              $projectName: String
            ) {
              addTask(
                title: $title
                description: $description
                status: $status
                dueDate: $dueDate
                assignedTo: $assignedTo
                assignedBy: $assignedBy
                projectId: $projectId
                projectName: $projectName
              ) {
                id
                title
                description
                status
                projectId
                projectName
                createdAt
                dueDate
                assignedTo {
                  id
                  username
                }
                assignedBy {
                  id
                  username
                }
              }
            }
          `,
          variables: {
            title: taskName,
            description,
            status,
            dueDate,
            assignedTo: assignedToId,
            assignedBy: user.id,
            projectId: projectId,
            projectName: projectTitle,
          },
        }),
      });

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0].message);
      }

      // Add the new task to the state
      setTasks((prevTasks) => [...prevTasks, data.addTask]);

      // Close the modal
      closeModal();
      alert("Task added successfully!");
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Failed to add task: " + err.message);
    }
  };

  // Update task status
  const sortState = async (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    let nextStatus;
    switch (task.status) {
      case "Pending":
        nextStatus = "In Progress";
        break;
      case "In Progress":
        nextStatus = "Completed";
        break;
      case "Completed":
        nextStatus = "On Hold";
        break;
      case "On Hold":
        nextStatus = "Cancelled";
        break;
      case "Cancelled":
        nextStatus = "Pending";
        break;
      default:
        nextStatus = "Pending";
    }

    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation {
              updateTaskStatus(id: "${taskId}", status: "${nextStatus}") {
                id
                status
              }
            }
          `,
        }),
      });

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(errors[0].message);
      }

      // Update the task in the state
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === taskId ? { ...t, status: nextStatus } : t
        )
      );
    } catch (err) {
      console.error("Error updating task status:", err);
      alert("Failed to update task status: " + err.message);
    }
  };

  const parseDate = (dateStr) => {
    let parts = dateStr.split("/");
    if (parts.length === 3) {
      let [month, day, year] = parts.map(Number);
      return new Date(year, month - 1, day);
    }
    return new Date(0);
  };

  const sortTable = (event) => {
    const table = tableRef.current; // Access the table using the ref
    if (!table) return;

    const rows = Array.from(table.querySelectorAll("tbody tr")); // Get all rows in the table body

    if (event.target.value === "Due Date") {
      rows.sort((a, b) => {
        let dateA = parseDate(a.cells[6].textContent.trim());
        let dateB = parseDate(b.cells[6].textContent.trim());
        return dateB - dateA;
      });
    } else if (event.target.value === "Project") {
      rows.sort((a, b) => {
        let projectA = a.cells[1].textContent.trim();
        let projectB = b.cells[1].textContent.trim();
        return projectA.localeCompare(projectB);
      });
    } else if (event.target.value === "Task Status") {
      const statusOrder = {
        Completed: 1,
        "In Progress": 2,
        Pending: 3,
      };

      rows.sort((a, b) => {
        let statusA = a.cells[5].textContent.trim();
        let statusB = b.cells[5].textContent.trim();
        return statusOrder[statusA] - statusOrder[statusB];
      });
    } else if (event.target.value === "Assigned Student") {
      rows.sort((a, b) => {
        let studentA = a.cells[4].textContent.trim();
        let studentB = b.cells[4].textContent.trim();
        return studentA.localeCompare(studentB);
      });
    }

    // Append sorted rows back to the table body
    const tbody = table.querySelector("tbody");
    rows.forEach((row) => tbody.appendChild(row));
  };

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchUsers(), fetchProjects()]);
        await fetchTasks();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-primary text-text min-h-screen p-6">
      <div className="flex justify-between items-center mb-6 mt-6 flex-wrap gap-4">
        <div className="flex items-center space-x-4 flex-shrink-0">
          <label htmlFor="sort" className="font-bold text-white">
            Sort By:
          </label>
          <select
            id="sort"
            className="bg-[#3d3b3be2] text-white p-2 rounded"
            onChange={sortTable}
          >
            <option value="Task Status">Task Status</option>
            <option value="Project">Project</option>
            <option value="Due Date">Due Date</option>
            <option value="Assigned Student">Assigned Student</option>
          </select>
        </div>

        <button
          onClick={openModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-bold"
        >
          Create a New Task
        </button>
      </div>

      <table
        ref={tableRef} // Attach the ref to the table
        id="tasksTable"
        className="w-full border-collapse bg-table rounded-lg overflow-hidden shadow-lg text-left border border-gray-600"
      >
        <thead className="bg-primary text-text">
          <tr className="border-b border-white transition-colors duration-200 cursor-pointer">
            <th className="p-4">Task ID</th>
            <th className="p-4">Project</th>
            <th className="p-4">Task Name</th>
            <th className="p-4">Description</th>
            <th className="p-4">Assigned Student</th>
            <th className="p-4">Status</th>
            <th className="p-4">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{`${task.id.substring(task.id.length - 1)}`}</td>
              <td>{task.projectName || "Unknown"}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.assignedTo?.username || "Unknown"}</td>
              <td
                className="status"
                onClick={() => sortState(task.id)}
                data-status={task.status}
              >
                {task.status}
              </td>
              <td>
                {task.dueDate
                  ? (() => {
                      try {
                        // محاولة تنسيق التاريخ
                        const date = new Date(task.dueDate);
                        if (!isNaN(date.getTime())) {
                          return date.toLocaleDateString();
                        }
                        return "Invalid date";
                      } catch (e) {
                        console.error("Error formatting date:", e);
                        return "Invalid date";
                      }
                    })()
                  : "No date"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && (
        <div>
          <div
            className="fixed inset-0 bg-black bg-opacity-60 z-40"
            onClick={closeModal}
          ></div>
          <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-[#2a2a2a] p-6 rounded w-full max-w-md shadow-xl">
            <button
              onClick={closeModal}
              className="absolute top-2 right-3 text-white text-2xl"
            >
              &times;
            </button>
            <h2 className="text-blue-500 mb-4 text-xl font-bold">
              Create New Task
            </h2>
            <form onSubmit={addTask} className="space-y-4">
              <div>
                <label className="block font-bold mb-1">Project Title:</label>
                <select
                  name="project-title"
                  className="w-full bg-[#444] p-2 rounded text-white"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.title}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Task Name:</label>
                <input
                  type="text"
                  name="task-name"
                  className="w-full bg-[#444] p-2 rounded text-white"
                  required
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Description:</label>
                <textarea
                  name="description"
                  className="w-full bg-[#444] p-2 rounded text-white"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block font-bold mb-1">
                  Assigned Student:
                </label>
                <select
                  name="assigned-student"
                  className="w-full bg-[#444] p-2 rounded text-white"
                  required
                >
                  {user.role === "admin" && (
                    <option value="">Select a student</option>
                  )}
                  {user.role === "admin" ? (
                    users
                      .filter((u) => u.role === "student")
                      .map((u) => (
                        <option key={u.id} value={u.username}>
                          {u.username}
                        </option>
                      ))
                  ) : (
                    <option value={user.username} selected>
                      {user.username}
                    </option>
                  )}
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Status:</label>
                <select
                  name="status"
                  className="w-full bg-[#444] p-2 rounded text-white"
                  required
                >
                  <option value="">Select a status</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                  <option>Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Due Date:</label>
                <input
                  type="date"
                  name="due-date"
                  className="w-full bg-[#444] p-2 rounded text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
              >
                Add Task
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
