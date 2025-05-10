import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import "../index.css";

const Tasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]); // State to store tasks
  const { user } = useAuth();
  const tableRef = useRef(null); // Create a ref for the table

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addTask = (event) => {
    event.preventDefault();

    // Get form values
    const projectTitle = event.target.elements["project-title"].value;
    const taskName = event.target.elements["task-name"].value;
    const description = event.target.elements["description"].value;
    const assignedStudent = event.target.elements["assigned-student"].value;
    const status = event.target.elements["status"].value;
    const dueDate = event.target.elements["due-date"].value;

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
    // Find the project ID based on the selected project title
    const data = JSON.parse(localStorage.getItem("data"));
    const project = data.projects.find((proj) => proj.title === projectTitle);
    const projectId = project ? project.id : null;

    const assignedUser = data.users.find((user) => {
      return user.username === assignedStudent;
    });
    const assignedTo = assignedUser ? assignedUser.id : null;

    const newTask = {
      id: tasks.length + 1, // Generate a new ID
      projectId: projectId,
      projectName: projectTitle,
      title: taskName,
      description,
      assignedTo: assignedTo,
      assignedToName: assignedStudent, // Assuming the student's name is passed
      status,
      createdAt: new Date().toISOString(),
      dueDate,
    };

    // Update tasks state
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    // Update localStorage
    data.tasks = updatedTasks;
    localStorage.setItem("data", JSON.stringify(data));

    // Close the modal
    closeModal();
    alert("Task added successfully!");
  };

  const sortState = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
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

        return { ...task, status: nextStatus };
      }
      return task;
    });

    setTasks(updatedTasks);

    // Update localStorage
    const data = JSON.parse(localStorage.getItem("data"));
    data.tasks = updatedTasks;
    localStorage.setItem("data", JSON.stringify(data));
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

  const loadTasks = () => {
    const data = JSON.parse(localStorage.getItem("data"));
    let storedTasks = data.tasks;

    if (user.role === "student") {
      storedTasks = storedTasks.filter((task) => task.assignedTo === user.id);
    }

    const users = data.users; // Assuming users are stored in the same localStorage data object
    storedTasks = storedTasks.map((task) => {
      const assignedUser = users.find((user) => user.id === task.assignedTo);
      return {
        ...task,
        assignedToName: assignedUser ? assignedUser.username : "Unknown",
      };
    });

    storedTasks = storedTasks.map((task) => {
      const project = data.projects.find(
        (project) => project.id === task.projectId
      );
      return {
        ...task,
        projectName: project ? project.title : "Unknown",
      };
    });

    setTasks(storedTasks);
  };

  useEffect(() => {
    loadTasks();
  }, []);

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
              <td>{task.id}</td>
              <td>{task.projectName}</td>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.assignedToName}</td>
              <td
                className="status"
                onClick={() => sortState(task.id)}
                data-status={task.status}
              >
                {task.status}
              </td>
              <td>{new Date(task.dueDate).toLocaleDateString()}</td>
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
                  <option value="Website Redesign">Website Redesign</option>
                  {JSON.parse(localStorage.getItem("data")).projects.map(
                    (project) => (
                      <option key={project.id} value={project.title}>
                        {project.title}
                      </option>
                    )
                  )}
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
                    JSON.parse(localStorage.getItem("data")).users.map(
                      (user) => (
                        <option key={user.id} value={user.username}>
                          {user.username}
                        </option>
                      )
                    )
                  ) : (
                    <option value="user.username" selected>
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
