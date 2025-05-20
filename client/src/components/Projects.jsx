"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [statusFilter, setStatusFilter] = useState("AllStatuses");
  const [newProject, setNewProject] = useState({});
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return "";

    // Check if it's a timestamp (number)
    if (!isNaN(dateString)) {
      return new Date(Number.parseInt(dateString)).toLocaleDateString();
    }

    // Otherwise try to parse the date string
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      console.error("Invalid date format:", dateString);
      return dateString; // Return original if parsing fails
    }
  };

  // Fetch all projects
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
                createdBy { id username }
                startDate
                endDate
                status
                category
                students { id username }
              }
            }
          `,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch projects");

      const { data, errors } = await response.json();

      if (errors) throw new Error(errors.map((e) => e.message).join(", "));

      return data.projects;
    } catch (err) {
      console.error("Error fetching projects:", err);
      throw err;
    }
  }

  // Fetch all students
  async function fetchStudents() {
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

      const { data, errors } = await response.json();

      if (errors) throw new Error(errors.map((e) => e.message).join(", "));

      // Filter only students
      return data.users.filter((user) => user.role === "student");
    } catch (err) {
      console.error("Error fetching students:", err);
      throw err;
    }
  }

  // Fetch tasks for a specific project
  async function fetchProjectTasks(projectId) {
    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
          query GetTasksByProject($projectId: ID!) {
            tasksByProject(projectId: $projectId) {
              id
              title
              description
              status
              assignedTo {
                id
                username
              }
              assignedBy {
                id
                username
              }
              createdAt
              dueDate
            }
          }
        `,
          variables: {
            projectId: projectId,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch tasks");

      const { data, errors } = await response.json();

      if (errors) throw new Error(errors.map((e) => e.message).join(", "));

      return data.tasksByProject;
    } catch (err) {
      console.error("Error fetching tasks:", err);
      throw err;
    }
  }

  // Add a new project
  async function addProject(projectData) {
    try {
      // Format the students array for the GraphQL mutation
      const studentsArray = selectedStudents.map((student) => student.id);

      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation AddProject(
              $title: String!,
              $description: String,
              $createdBy: ID,
              $startDate: String,
              $endDate: String,
              $status: String,
              $category: String,
              $students: [ID]
            ) {
              addProject(
                title: $title,
                description: $description,
                createdBy: $createdBy,
                startDate: $startDate,
                endDate: $endDate,
                status: $status,
                category: $category,
                students: $students
              ) {
                id
                title
                description
                createdBy {
                  id
                  username
                }
                startDate
                endDate
                status
                category
                students {
                  id
                  username
                }
              }
            }
          `,
          variables: {
            title: projectData.title,
            description: projectData.description,
            createdBy: user ? user.id || user._id : null,
            startDate: projectData.startDate,
            endDate: projectData.endDate,
            status: projectData.status,
            category: projectData.category,
            students: studentsArray,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to add project");

      const { data, errors } = await response.json();

      if (errors) throw new Error(errors.map((e) => e.message).join(", "));

      return data.addProject;
    } catch (err) {
      console.error("Error adding project:", err);
      throw err;
    }
  }

  // Load projects and students when component mounts
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [projectsData, studentsData] = await Promise.all([
          fetchProjects(),
          fetchStudents(),
        ]);

     
        // Filter projects for students to only show assigned ones
        if (user && user.role === "student") {
          // Try to get user ID from different possible properties
          const userId = user.id || user._id;
          const username = user.username;

          const assignedProjects = projectsData.filter((project) => {
           

            // Try to match by ID first (checking different ID formats)
            const matchById = project.students.some((student) => {
              const studentId = student.id || student._id;
              return String(studentId) === String(userId);
            });

            // If ID match fails, try to match by username
            const matchByUsername = project.students.some(
              (student) => student.username === username
            );

            return matchById || matchByUsername;
          });

       
          setProjects(assignedProjects);
          setFilteredProjects(assignedProjects);
        } else {
          // For admin users, show all projects
          setProjects(projectsData);
          setFilteredProjects(projectsData);
        }

        setStudents(studentsData);
        setError(null);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [user]);

  // Filter projects based on search query and status filter
  useEffect(() => {
    let filtered = projects;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((project) => {
        const matchesTitle = project.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesDescription = project.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return matchesTitle || matchesDescription;
      });
    }

    // Apply status filter
    if (statusFilter !== "AllStatuses") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [searchQuery, statusFilter, projects]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleStudentSelection = (event, student) => {
    if (event.target.checked) {
      setSelectedStudents((prev) => [...prev, student]);
    } else {
      setSelectedStudents((prev) => prev.filter((s) => s.id !== student.id));
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewProject({});
    setSelectedStudents([]);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setActiveProject(null);
  };

  const openSidebar = async (projectId) => {
    try {
      // If clicking the same project that's already open, toggle sidebar closed
      if (isSidebarOpen && activeProject?.id === projectId) {
        setIsSidebarOpen(false);
        setActiveProject(null);
        return;
      }

      // Find the project in current state
      const project = projects.find((p) => p.id === projectId);

      if (!project) {
        alert("Project not found!");
        return;
      }

      // Fetch tasks for this project
      const projectTasks = await fetchProjectTasks(projectId);

      // Set the active project with its tasks
      setActiveProject({
        ...project,
        tasks: projectTasks,
      });

      // Show the sidebar
      setIsSidebarOpen(true);
    } catch (err) {
      alert(`Error loading project details: ${err.message}`);
    }
  };

  if (loading)
    return (
      <div className="text-white text-center p-4">Loading projects...</div>
    );
  if (error)
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;

  // Show a message when no projects are found for students
  const noProjectsMessage = (
    <div className="w-full text-center p-8">
      <p className="text-gray-400 text-lg">No projects assigned to you yet.</p>
    </div>
  );

  return (
    <>
      {/* Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          id="overlay"
          onClick={closeModal}
        ></div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ease-in-out z-100 bg-[#1e1e1e] w-4/5 max-w-lg p-6 rounded-lg border border-gray-400"
          id="projectModal"
          style={{
            scrollbarWidth: "none",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start">
            <h2 className="text-blue-500 text-xl font-bold">Add New Project</h2>
            <button
              onClick={closeModal}
              className="text-white bg-gray-800 border border-gray-800 w-8 h-8 text-xl font-bold"
            >
              &times;
            </button>
          </div>
          <form
            id="myForm"
            className="flex flex-col space-y-4"
            onSubmit={(e) => {
              e.preventDefault();

              // Validate dates
              if (newProject.startDate > newProject.endDate) {
                alert("Start date cannot be greater than end date");
                return;
              }

              // Add the project to the database
              addProject(newProject)
                .then((addedProject) => {
                  // Update the local state with the new project
                  setProjects((prev) => [...prev, addedProject]);

                  // Reset form and close modal
                  setNewProject({});
                  setSelectedStudents([]);
                  closeModal();

                  alert("Project added successfully!");
                })
                .catch((err) => {
                  alert(`Error adding project: ${err.message}`);
                });
            }}
          >
            <label htmlFor="title" className="text-white font-bold m-0">
              Project Title:
            </label>
            <input
              name="title"
              type="text"
              className="w-full h-10 bg-[#393939] text-white border border-gray-400 rounded-lg p-2"
              onChange={(e) =>
                setNewProject({ ...newProject, title: e.target.value })
              }
              value={newProject.title || ""}
              placeholder="Enter project title"
              required
            />

            <label htmlFor="description" className="text-white font-bold m-0">
              Project Description:
            </label>
            <textarea
              name="description"
              className="w-full h-20 bg-[#393939] text-white border border-gray-400 rounded-lg p-2"
              onChange={(e) =>
                setNewProject({ ...newProject, description: e.target.value })
              }
              value={newProject.description || ""}
              placeholder="Enter project description"
              required
            ></textarea>

            <label htmlFor="studentList" className="text-white font-bold m-0">
              Students List:
            </label>
            <div
              id="studentListContainer"
              className="w-full max-h-25 overflow-y-auto bg-[#393939] text-white border border-gray-400 rounded-lg p-2 flex flex-col"
            >
              {students.map((student) => {
                const isSelected = selectedStudents.some(
                  (s) => s.id === student.id
                );

                return (
                  <label
                    key={student.id}
                    htmlFor={`student_${student.id}`}
                    className={`flex items-center px-3 py-2 rounded cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? "bg-gray-600 text-gray-300"
                        : "bg-transparent text-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={`student_${student.id}`}
                      value={student.id}
                      onChange={(e) => handleStudentSelection(e, student)}
                      className="hidden"
                      checked={isSelected}
                      readOnly
                    />
                    <span className="text-sm">{student.username}</span>
                  </label>
                );
              })}
            </div>

            <label htmlFor="category" className="text-white font-bold m-0">
              Project Category:
            </label>
            <div className="relative">
              <select
                name="category"
                id="category"
                className="w-full h-10 bg-[#393939] text-white border border-gray-400 rounded-lg p-2 appearance-none"
                onChange={(e) =>
                  setNewProject({ ...newProject, category: e.target.value })
                }
                value={newProject.category || ""}
                required
              >
                <option value="">Select a Category</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Web Development">Web Development</option>
                <option value="Data Science">Data Science</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Others">Others</option>
              </select>
              <i className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-700 fa fa-chevron-down"></i>
            </div>

            <label htmlFor="startDate" className="text-white font-bold m-0">
              Starting Date:
            </label>
            <div className="relative">
              <input
                name="startDate"
                id="startDate"
                type="date"
                className="w-full h-10 bg-[#393939] text-white border border-gray-400 rounded-lg p-2"
                onChange={(e) =>
                  setNewProject({ ...newProject, startDate: e.target.value })
                }
                value={newProject.startDate || ""}
                required
              />
              <i className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-700 fa fa-calendar"></i>
            </div>

            <label htmlFor="endDate" className="text-white font-bold m-0">
              Ending Date:
            </label>
            <div className="relative">
              <input
                name="endDate"
                id="endDate"
                type="date"
                className="w-full h-10 bg-[#393939] text-white border border-gray-400 rounded-lg p-2"
                onChange={(e) =>
                  setNewProject({ ...newProject, endDate: e.target.value })
                }
                value={newProject.endDate || ""}
                required
              />
              <i className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-700 fa fa-calendar"></i>
            </div>

            <label htmlFor="status" className="text-white font-bold m-0">
              Project Status:
            </label>
            <div className="relative">
              <select
                name="status"
                className="w-full h-10 bg-[#393939] text-white border border-gray-400 rounded-lg p-2 appearance-none"
                onChange={(e) =>
                  setNewProject({ ...newProject, status: e.target.value })
                }
                value={newProject.status || ""}
                required
              >
                <option value="">Select Status</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="On Hold">On Hold</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <i className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-700 fa fa-chevron-down"></i>
            </div>

            <button
              id="submitProject"
              type="submit"
              className="w-full h-10 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700"
            >
              Add Project
            </button>
          </form>
        </div>
      )}

      {user && user.role !== "student" ? (
        <>
          <h2 className="text-blue-500 text-xl font-bold">Projects Overview</h2>
          <section
            className="flex items-center justify-between mb-4 mt-6 gap-4"
            id="content"
          >
            <button
              id="addProj"
              onClick={openModal}
              className="w-1/5 h-10 bg-blue-500 text-white rounded-lg text-sm"
            >
              Add Project
            </button>
            <input
              id="searchProject"
              type="text"
              placeholder="Search Projects By Title Or Description..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-4/5 h-10 mr-3 rounded-lg placeholder:text-sm bg-white border border-gray-400 text-black p-2"
            />

            <div className="relative flex w-1/5">
              <select
                id="status"
                name="status"
                className="w-full h-10 rounded-lg text-center text-sm appearance-none cursor-pointer bg-white border border-gray-400 text-black"
                onChange={(e) => setStatusFilter(e.target.value)}
                value={statusFilter}
              >
                <option value="AllStatuses">All Statuses</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="On Hold">On Hold</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <i className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-700 font-bold text-xs fa fa-chevron-down"></i>
            </div>
          </section>
        </>
      ) : (
        <>
          <h2 className="text-blue-500 text-xl font-bold">
            My Assigned Projects
          </h2>
          <section
            className="flex items-center justify-between mb-4 mt-6 gap-4"
            id="content"
          >
            <input
              id="searchProject"
              type="text"
              placeholder="Search Projects By Title Or Description..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full h-10 mr-3 rounded-lg placeholder:text-sm bg-white border border-gray-400 text-black p-2"
            />
          </section>
        </>
      )}

      <div
        id="projectContainer"
        style={{ scrollbarWidth: "none" }}
        className="maindiv flex flex-wrap overflow-y-scroll h-auto"
      >
        {filteredProjects.length > 0
          ? filteredProjects.map((project, index) => {
              // Calculate progress percentage
              let startDate, endDate, today;
              let progressPercentage;

              try {
                // Handle different date formats (string, timestamp, etc.)
                startDate = new Date(
                  isNaN(project.startDate)
                    ? project.startDate
                    : Number.parseInt(project.startDate)
                );
                endDate = new Date(
                  isNaN(project.endDate)
                    ? project.endDate
                    : Number.parseInt(project.endDate)
                );
                today = new Date();

                // Check if dates are valid
                if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                  throw new Error("Invalid date");
                }

                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                today.setHours(0, 0, 0, 0);

                const totalDuration = Math.max(
                  (endDate - startDate) / (1000 * 60 * 60 * 24),
                  1
                );
                const elapsedDuration = Math.max(
                  (today - startDate) / (1000 * 60 * 60 * 24),
                  0
                );
                progressPercentage = Math.round(
                  (elapsedDuration / totalDuration) * 100
                );
                progressPercentage = Math.min(
                  Math.max(progressPercentage, 0),
                  100
                );
              } catch (e) {
                console.error("Error calculating progress:", e);
                progressPercentage = 0;
              }

              // Determine border color based on status
              const borderColor =
                {
                  "In Progress": "border-green-500",
                  Completed: "border-blue-500",
                  Pending: "border-orange-500",
                  "On Hold": "border-yellow-500",
                  Cancelled: "border-red-500",
                }[project.status] || "border-gray-500";

              // Get student names
              const studentsNames = project.students.map(
                (student) => student.username
              );

              return (
                <div
                  key={project.id}
                  data-project-id={project.id}
                  className={`flex flex-col bg-[#393939] text-white rounded-lg border ${borderColor} p-4 m-2 w-full md:w-1/3 lg:w-1/4 h-auto cursor-pointer`}
                  onClick={() => openSidebar(project.id)}
                >
                  <h3
                    id={`projectTitle_${index}`}
                    className="text-lg font-bold text-blue-400 mb-2"
                  >
                    {project.title}
                  </h3>
                  <p className="mb-2">
                    <strong>Description:</strong>{" "}
                    <span id={`projectDescription_${index}`}>
                      {project.description}
                    </span>
                  </p>
                  <p className="mb-2">
                    <strong>Students:</strong>{" "}
                    <span id={`projectStudents_${index}`}>
                      {studentsNames.join(", ")}
                    </span>
                  </p>
                  <p className="mb-2">
                    <strong>Category:</strong>{" "}
                    <span id={`projectCategory_${index}`}>
                      {project.category}
                    </span>
                  </p>
                  <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden mb-2">
                    <div
                      className="bg-blue-500 h-full text-center text-xs text-white font-bold"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      {progressPercentage}%
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <p id={`projectCreatedAt_${index}`}>
                      {formatDate(project.startDate)}
                    </p>
                    <p id={`projectDeadline_${index}`}>
                      {formatDate(project.endDate)}
                    </p>
                  </div>
                </div>
              );
            })
          : // Show message when no projects are found
            noProjectsMessage}
      </div>

      {/* Sidebar */}
      {isSidebarOpen && activeProject && (
        <div className="fixed top-0 right-0 bottom-0 w-1/4 h-full bg-[#1e1e1e] border border-gray-500 text-sm overflow-y-auto z-50">
          <div className="p-4 text-white">
            <h2 className="text-xl font-bold text-blue-500">
              {activeProject.title}
            </h2>
            <p>
              <strong className="text-gray-400">Description:</strong>{" "}
              <span className="text-gray-300">{activeProject.description}</span>
            </p>
            <p>
              <strong className="text-gray-400">Category:</strong>{" "}
              <span className="text-gray-300">{activeProject.category}</span>
            </p>
            <p>
              <strong className="text-gray-400">Students:</strong>{" "}
              <span className="text-gray-300">
                {activeProject.students.map((s) => s.username).join(", ")}
              </span>
            </p>
            <p>
              <strong className="text-gray-400">Start Date:</strong>{" "}
              <span className="text-gray-300">
                {formatDate(activeProject.startDate)}
              </span>
            </p>
            <p>
              <strong className="text-gray-400">End Date:</strong>{" "}
              <span className="text-gray-300">
                {formatDate(activeProject.endDate)}
              </span>
            </p>
            <h3 className="text-lg font-bold text-gray-400 mt-4">Tasks</h3>
            <div className="space-y-4">
              {activeProject.tasks && activeProject.tasks.length > 0 ? (
                activeProject.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-[#393939] p-4 rounded-lg border border-gray-600"
                  >
                    <p className="text-sm text-gray-300">
                      <strong>Task ID:</strong> {task.id}
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong>Task Name:</strong> {task.title}
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong>Description:</strong> {task.description}
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong>Assigned Student:</strong>{" "}
                      {task.assignedTo ? task.assignedTo.username : "None"}
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong>Status:</strong> {task.status}
                    </p>
                    {task.dueDate && (
                      <p className="text-sm text-gray-300">
                        <strong>Due Date:</strong> {formatDate(task.dueDate)}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-400">
                  No tasks found for this project.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
