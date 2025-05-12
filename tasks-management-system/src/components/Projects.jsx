import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [data, setData] = useState(null); //this must be handeleded when the data base is created
  const [statusFilter, setStatusFilter] = useState("AllStatuses");
  const [newProject, setNewProject] = useState({});
  const [selectedStudents, setSelectedStudents] = useState([]); // State to store selected students
  const { user } = useAuth();

  useEffect(() => {
    // Load all projects from localStorage on component mount
    const localData = JSON.parse(localStorage.getItem("data"));

    setData(localData); // Store data in state

    const projects = [...localData.projects];
    setAllProjects(projects); // Store all projects in state
    setFilteredProjects(projects); // Initially, show all projects
  }, []);

  useEffect(() => {
    // Filter projects whenever the search query changes
    let filtered = allProjects.filter((project) => {
      const matchesTitle = project.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesDescription = project.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesTitle || matchesDescription;
    });

    // If a status filter is applied, further filter the projects
    if (statusFilter !== "AllStatuses") {
      filtered = filtered.filter((project) => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [searchQuery, allProjects, statusFilter]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value); // Update the search query state
  };

  const handleStudentSelection = (event, student) => {
    if (event.target.checked) {
      // Add the student to the selected list
      setSelectedStudents((prev) => [...prev, student]);
    } else {
      // Remove the student from the selected list
      setSelectedStudents((prev) => prev.filter((s) => s.id !== student.id));
    }
  };
  const openModal = () => {
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false); // Hide the sidebar
    setActiveProject(null); // Clear the active project
  };

  const openSidebar = (projectId) => {
    const data = JSON.parse(localStorage.getItem("data"));

    if (!data || !data.projects) {
      console.error("No project data found.");
      return;
    }

    // Find project by ID
    const project = data.projects.find((p) => p.id === projectId);

    if (!project) {
      alert("Project not found!");
      return;
    }

    const users = data.users;

    const studentsIds = data.student_projects.filter(
      (stuProj) => stuProj.projectId === project.id
    );
    const studentsNames = studentsIds.map((stuProj) => {
      const student = users.find((user) => user.id === stuProj.studentId);
      return student ? student.username : "Unknown";
    });

    // Retrieve tasks from localStorage
    const tasksData = data.tasks || [];
    const projectTasks = tasksData.filter(
      (task) => task.projectId === project.id
    );

    projectTasks.forEach((task) => {
      const assignedStudent = users.find((user) => user.id === task.assignedTo);
      task.assignedToName = assignedStudent
        ? assignedStudent.username
        : "Unknown";
    });

    // Set the active project data
    setActiveProject({
      ...project,
      studentsNames,
      tasks: projectTasks,
    });

    // Show the sidebar
    setIsSidebarOpen(true);
  };

  const addNewProject = (event) => {
    event.preventDefault();

    const newProjectData = {
      ...newProject,
      id: allProjects.length + 1,
      createdBy: user.id,
    };
    if (newProjectData.startDate > newProjectData.endDate) {
      alert("Start date cannot be greater than end date");
      return;
    }

    const updatedData = data;
    updatedData.projects.push(newProjectData);

    selectedStudents.forEach((student) => {
      updatedData.student_projects.push({
        studentId: student.id,
        projectId: newProjectData.id,
      });
    });

    localStorage.setItem("data", JSON.stringify(updatedData));

    setNewProject({});
    setSelectedStudents([]);
    closeModal();
    alert("Project added successfully!");
    setAllProjects((prev) => [...prev, newProjectData]); // Update the projects list
  };

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
          className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ease-in-out z-100 bg-gray-800 w-4/5 max-w-lg p-6 rounded-lg border border-gray-400"
          id="projectModal"
          style={{
            scrollbarWidth: "none",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <div className="flex justify-between items-start">
            <h2 className="text-blue-500 text-lg font-bold">Add New Project</h2>
            <button
              onClick={closeModal} // Close modal when clicking the close button
              className="text-white bg-gray-800 border border-gray-800 w-8 h-8 text-xl font-bold"
            >
              &times;
            </button>
          </div>
          <form
            id="myForm"
            className="flex flex-col space-y-4"
            onSubmit={addNewProject}
          >
            <label htmlFor="title" className="text-white font-bold m-0">
              Project Title:
            </label>
            <input
              name="title"
              type="text"
              className="w-full h-10 bg-gray-800 text-white border border-gray-400 rounded-lg p-2"
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
              className="w-full h-20 bg-gray-800 text-white border border-gray-400 rounded-lg p-2"
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
              className="w-full max-h-25 overflow-y-auto bg-gray-800 text-white border border-gray-400 rounded-lg p-2 flex flex-col"
            >
              {data &&
                data.users.map(
                  (student) =>
                    student.role == "student" && (
                      <div
                        key={student.id}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          id={`student_${student.id}`}
                          value={student.id}
                          onChange={(e) => handleStudentSelection(e, student)}
                          className="form-checkbox h-4 w-4 "
                        />
                        <label
                          htmlFor={`student_${student.id}`}
                          className="text-sm"
                        >
                          {student.username}
                        </label>
                      </div>
                    )
                )}
            </div>

            <label htmlFor="category" className="text-white font-bold m-0">
              Project Category:
            </label>
            <div className="relative">
              <select
                name="category"
                id="category"
                className="w-full h-10 bg-gray-800 text-white border border-gray-400 rounded-lg p-2 appearance-none"
                onChange={(e) =>
                  setNewProject({ ...newProject, category: e.target.value })
                }
                value={newProject.category || ""}
              >
                <option value="Select">Select a Category</option>
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
                className="w-full h-10 bg-gray-800 text-white border border-gray-400 rounded-lg p-2"
                onChange={(e) =>
                  setNewProject({ ...newProject, startDate: e.target.value })
                }
                value={newProject.startDate || ""}
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
                className="w-full h-10 bg-gray-800 text-white border border-gray-400 rounded-lg p-2"
                onChange={(e) =>
                  setNewProject({ ...newProject, endDate: e.target.value })
                }
                value={newProject.endDate || ""}
              />
              <i className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-700 fa fa-calendar"></i>
            </div>

            <label htmlFor="status" className="text-white font-bold m-0">
              Project Status:
            </label>
            <div className="relative">
              <select
                name="status"
                className="w-full h-10 bg-gray-800 text-white border border-gray-400 rounded-lg p-2 appearance-none"
                onChange={(e) =>
                  setNewProject({ ...newProject, status: e.target.value })
                }
                value={newProject.status || ""}
              >
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="OnHold">On Hold</option>
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

      <h2 className="text-blue-500 text-lg font-bold">Projects Overview</h2>
      <section
        className="flex items-center justify-between mb-4 mt-6 gap-4"
        id="content"
      >
        <button
          id="addProj"
          onClick={openModal} // Open modal when clicking the button
          className="w-1/5 h-10 bg-blue-500 text-white rounded-lg text-sm"
        >
          Add Project
        </button>
        <input
          id="searchProject"
          type="text"
          placeholder="Search Projects By Title Or Description..."
          value={searchQuery} // Bind input value to state
          onChange={handleSearchChange} // Update state on input change
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
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="OnHold">On Hold</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <i className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-700 font-bold text-xs fa fa-chevron-down"></i>
        </div>
      </section>

      <div
        id="projectContainer"
        style={{ scrollbarWidth: "none" }}
        className="maindiv flex flex-wrap overflow-y-scroll h-auto"
      >
        {(searchQuery.length == 0 && statusFilter == "AllStatuses"
          ? allProjects
          : filteredProjects
        ).map((project, index) => {
          const startDate = new Date(project.startDate);
          const endDate = new Date(project.endDate);
          const today = new Date();

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
          let progressPercentage = Math.round(
            (elapsedDuration / totalDuration) * 100
          );
          progressPercentage = Math.min(Math.max(progressPercentage, 0), 100);

          const studentsIds = data.student_projects.filter(
            (stuProj) => stuProj.projectId === project.id
          );
          const studentsNames = studentsIds.map((stuProj) => {
            const student = data.users.find(
              (user) => user.id === stuProj.studentId
            );
            return student ? student.username : "Unknown";
          });

          const borderColor =
            {
              InProgress: "border-green-500",
              Completed: "border-blue-500",
              Pending: "border-orange-500",
            }[project.status] || "border-gray-500";

          return (
            <div
              key={project.id}
              data-project-id={project.id}
              className={`flex flex-col bg-gray-800 text-white rounded-lg border ${borderColor} p-4 m-2 w-full md:w-1/3 lg:w-1/4 h-auto`}
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
                <span id={`projectCategory_${index}`}>{project.category}</span>
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
                <p id={`projectCreatedAt_${index}`}>{project.startDate}</p>
                <p id={`projectDeadline_${index}`}>{project.endDate}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar */}
      {isSidebarOpen && activeProject && (
        <div className="fixed top-0 right-0 bottom-0 w-1/4 h-full bg-gray-900 border border-gray-500 text-sm overflow-y-auto z-50">
          <div className="p-4 text-white">
            <button
              onClick={closeSidebar}
              className="text-white bg-red-500 px-2 py-1 rounded mb-4"
            >
              Close
            </button>
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
                {activeProject.studentsNames.join(", ")}
              </span>
            </p>
            <p>
              <strong className="text-gray-400">Start Date:</strong>{" "}
              <span className="text-gray-300">{activeProject.startDate}</span>
            </p>
            <p>
              <strong className="text-gray-400">End Date:</strong>{" "}
              <span className="text-gray-300">{activeProject.endDate}</span>
            </p>
            <h3 className="text-lg font-bold text-gray-400 mt-4">Tasks</h3>
            <div className="space-y-4">
              {activeProject.tasks.length > 0 ? (
                activeProject.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-gray-800 p-4 rounded-lg border border-gray-600"
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
                      {task.assignedToName || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-300">
                      <strong>Status:</strong> {task.status}
                    </p>
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
