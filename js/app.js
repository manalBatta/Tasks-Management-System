//intialization
(function () {
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
        password: "hashedpassword1",
        role: "admin",
        universityID: null,
      },
      {
        id: 2,
        username: "AliYaseen",
        password: "hashedpassword2",
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
        id: 10,
        title: "Data Collection",
        description: "Gather historical weather data.",
        status: "Pending",
        assignedTo: 7,
        assignedBy: 1,
        projectId: 1,
        createdAt: "2024-02-26T12:00:00Z",
      },
      {
        id: 11,
        title: "UI Design",
        description: "Create a responsive UI for the web app.",
        status: "In Progress",
        assignedTo: 10,
        assignedBy: 1,
        projectId: 1,
        projectTitle: "Web App Development",
        createdAt: "2024-02-26T12:30:00Z",
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
})();

const updateTime = () => {
  const now = new Date();
  const formattedTime = now.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  try {
    document.querySelector(".real-time-display").textContent = formattedTime;
  } catch (err) {
    console.log(
      "It's ok the document is not loaded yet to write real time",
      err
    );
  }
};

const highlightSelectedPageLink = (page) => {
  const linksListElements = document.getElementsByClassName("sidebar-item");
  for (let i = 0; i < linksListElements.length; i++) {
    if (linksListElements.item(i).dataset.value === page) {
      linksListElements.item(i).classList.add("selected");
    } else linksListElements.item(i).classList.remove("selected");
  }
};

const loadChart = () => {
  const ctx = document.getElementById("myChart");
  const data = JSON.parse(localStorage.getItem("data"));
  const projectsCount = data.projects.length;
  const studentsCount = data.users.filter(
    (user) => user.role === "student"
  ).length;
  const tasksCount = data.tasks.length;
  const finishedProjectsCount = data.projects.filter(
    (project) => project.status === "Completed"
  ).length;

  document.getElementById("projectsCount").innerHTML = projectsCount;
  document.getElementById("studentsCount").textContent = studentsCount;
  document.getElementById("tasksCount").textContent = tasksCount;
  document.getElementById("finishedProjectsCount").textContent =
    finishedProjectsCount;

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Projects", "Students", "Tasks", "Finished Projects"],
      datasets: [
        {
          label: "count",
          data: [
            projectsCount,
            studentsCount,
            tasksCount,
            finishedProjectsCount,
          ],
          backgroundColor: [
            "rgba(255, 99, 133, 0.18)",
            "rgba(54, 163, 235, 0.2)",
            "rgba(255, 207, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: true,
          text: "Admin Dashboard Overview",
        },
      },
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

let chatContact;
const loadContacts = () => {
  const userID = JSON.parse(localStorage.getItem("user")).id;
  const contacts = JSON.parse(localStorage.getItem("data")).users.filter(
    (user) => user.id !== userID
  );

  const list = document.getElementById("contacts-list");
  contacts.forEach((contact) => {
    const li = `<li class="contact-item" onclick="loadChat(${contact.id})">${contact.username}</li>`;
    list.innerHTML += li;
  });

  chatContact = contacts[0];

  chatContact = contacts[0];
};

const loadChat = (contactId) => {
  const chatHeader = document.getElementById("chat-header");
  const data = JSON.parse(localStorage.getItem("data"));

  const contacts = data.users;
  const contact = contacts.find((contact) => contact.id === contactId);
  chatHeader.innerHTML = `chatting width ${contact.username}...`;
  chatContact = contact;

  const userId = JSON.parse(localStorage.getItem("user")).id;
  const messages = data.chat.filter(
    (message) =>
      (message.senderId === userId && message.receiverId === contactId) ||
      (message.senderId === contactId && message.receiverId === userId)
  );

  const messagesList = document.getElementById("messages-list");
  messagesList.innerHTML = "";
  messages.forEach((message) => {
    const li = `<li class="message">
        <p class="message-content ${
          message.senderId === userId ? "myMessage" : ""
        }">${message.message}</p>
      </li>`;
    messagesList.innerHTML += li;
  });
  if (messagesList.lastElementChild)
    messagesList.lastElementChild.scrollIntoView({ behavior: "smooth" });
};

sendMessage = () => {
  if (chatContact != null) {
    const input = document.getElementById("message-input");
    const text = input.value;
    const data = JSON.parse(localStorage.getItem("data"));
    /* const messagesList = document.getElementById("messages-list"); */

    input.value = "";
    localStorage.setItem(
      "data",
      JSON.stringify({
        ...data,
        chat: [
          ...data.chat,
          {
            id: data.chat.length + 1,
            senderId: JSON.parse(localStorage.getItem("user")).id,
            receiverId: chatContact.id,
            message: text,
            timestamp: new Date().toISOString(),
          },
        ],
      })
    );

    loadChat(chatContact.id);
  }
};

const isStudent = (event) => {
  const universityIdContainer = document.getElementById(
    "university-id-container"
  );

  const studentCheckbox = event.target;
  if (studentCheckbox.checked) {
    universityIdContainer.style.display = "block";
  } else {
    universityIdContainer.style.display = "none";
  }
};

const userTypeDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user.role === "admin") {
    mainRoute("dashboard");
  } else {
    mainRoute("dashboardStudentView");
  }
};
const homeIntialize = () => {
  loadChart();
  updateTime();
  return setInterval(updateTime, 1000);
};

const homeStudentIntialize = () => {
  const data = JSON.parse(localStorage.getItem("data"));
  const userId = JSON.parse(localStorage.getItem("user")).id;
  const tasksCount = data.tasks.filter(
    (task) => task.assignedTo === userId
  ).length;
  document.getElementById("StudentTasksCount").textContent = tasksCount;

  updateTime();
  return setInterval(updateTime, 1000);
};

const sortTable = (event) => {
  document.getElementById("sort").addEventListener("change", function () {
    let table = document.getElementById("tasksTable");
    let rows = Array.from(table.querySelectorAll("tbody tr"));

    if (this.value === "Due Date") {
      rows.sort((a, b) => {
        let dateA = parseDate(a.cells[6].textContent.trim());
        let dateB = parseDate(b.cells[6].textContent.trim());

        return dateB - dateA;
      });

      rows.forEach((row) => table.querySelector("tbody").appendChild(row));
    } else if (this.value === "Project") {
      rows.sort((a, b) => {
        let projectA = a.cells[1].textContent.trim();
        let projectB = b.cells[1].textContent.trim();

        if (projectA === projectB) {
          return 0;
        }

        return projectA.localeCompare(projectB);
      });

      rows.forEach((row) => table.querySelector("tbody").appendChild(row));
    } else if (this.value === "Task Status") {
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

      rows.forEach((row) => table.querySelector("tbody").appendChild(row));
    } else if (this.value === "Assigned Student") {
      rows.sort((a, b) => {
        let studentA = a.cells[4].textContent.trim();
        let studentB = b.cells[4].textContent.trim();

        return studentA.localeCompare(studentB);
      });

      rows.forEach((row) => table.querySelector("tbody").appendChild(row));
    }
  });
};

function parseDate(dateStr) {
  let parts = dateStr.split("/");
  if (parts.length === 3) {
    let [month, day, year] = parts.map(Number);
    return new Date(year, month - 1, day);
  }
  return new Date(0);
}

const sortState = (event, taskId) => {
  let cell = event.target;
  let currentStatus = cell.textContent.trim();

  let nextStatus;
  if (currentStatus === "Pending") {
    nextStatus = "In Progress";
  } else if (currentStatus === "In Progress") {
    nextStatus = "Completed";
  } else if (currentStatus === "Completed") {
    nextStatus = "On Hold";
  } else if (currentStatus === "On Hold") {
    nextStatus = "Cancled";
  } else if (currentStatus === "Cancled") {
    nextStatus = "Pending";
  } else {
    nextStatus = "Pending";
  }

  cell.textContent = nextStatus;
  cell.parentElement.setAttribute("data-status", nextStatus);
  cell.parentElement.classList.remove(
    "status-pending",
    "status-inprogress",
    "status-completed",
    "status-onHold",
    "status-cancled"
  );
  cell.parentElement.classList.add(getStatusClass(nextStatus));

  const data = JSON.parse(localStorage.getItem("data"));
  let tasks = data.tasks;
  const task = tasks.find((task) => task.id === taskId);
  task.status = nextStatus;
  tasks = tasks.filter((task) => task.id !== taskId);
  localStorage.setItem(
    "data",
    JSON.stringify({ ...data, tasks: [...tasks, task] })
  );
};

const loadTasks = () => {
  //Add event listener to the add task form
  const openBtn = document.querySelector(".create-task");
  const closeBtn = document.querySelector(".close-btn");
  const overlay = document.querySelector(".overlay");
  const taskContainer = document.querySelector(".task-container");

  openBtn.addEventListener("click", () => {
    overlay.style.display = "block";
    taskContainer.style.display = "flex";
    populateTaskForm();
  });

  closeBtn.addEventListener("click", () => {
    overlay.style.display = "none";
    taskContainer.style.display = "none";
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.style.display = "none";
      taskContainer.style.display = "none";
    }
  });

  //display tasks on the table
  const tableBody = document.querySelector("#tasksTable tbody");

  const data = JSON.parse(localStorage.getItem("data"));
  const user = JSON.parse(localStorage.getItem("user"));
  let storedTasks = data.tasks;
  const users = data.users;
  const projects = data.projects;

  if (user.role === "student") {
    storedTasks = storedTasks.filter((task) => task.assignedTo === user.id);
  }
  tableBody.innerHTML = "";

  storedTasks.forEach((task) => {
    const row = document.createElement("tr");
    const project = projects.find((project) => project.id === task.projectId);
    const student = users.find((user) => user.id === task.assignedTo);

    row.innerHTML = `
        <td><span>${task.id}</span></td>
        <td><span>${project.title}</span></td>
        <td><span>${task.title}</span></td>
        <td><span>${task.description}</span></td>
        <td><span>${student.username}</span></td>
        <td class="status ${getStatusClass(
          task.status
        )}"  onclick="sortState(event,${task.id})"  data-status="${
      task.status
    }">
          <span >${task.status}</span>
        </td>
        <td><span>${new Date(task.createdAt).toLocaleDateString()}</span></td>
      `;

    tableBody.appendChild(row);
  });
};

const populateTaskForm = () => {
  const storedData = JSON.parse(localStorage.getItem("data"));
  const user = JSON.parse(localStorage.getItem("user"));

  const { projects, users } = storedData;

  const projectDropdown = document.getElementById("project-title");
  projectDropdown.innerHTML = "<option>Select a project</option>";

  if (user.role === "student") {
    /* will be continued when asking to add a new table that combines the projectid and studentID */
    /*     projects.filter((project) => project.createdBy === user.id);
     */
  }
  projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.title;
    projectDropdown.appendChild(option);
  });

  const studentDropdown = document.getElementById("assigned-student");
  studentDropdown.innerHTML = "<option>Select a student</option>";

  users
    .filter((user) => user.role === "student")
    .forEach((student) => {
      const option = document.createElement("option");
      option.value = student.id;
      option.textContent = student.username;
      studentDropdown.appendChild(option);
    });
  if (user.role === "student") {
    const assignedStudent = document.getElementById("assigned-student");
    assignedStudent.innerHTML = `<option value=${user.id}>${user.username}</option>`;
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case "Pending":
      return "status-pending";
    case "In Progress":
      return "status-inprogress";
    case "Completed":
      return "status-completed";
    case "On Hold":
      return "status-onHold";
    case "Cancled":
      return "status-cancled";

    default:
      return "";
  }
};

const addnewTask = (event) => {
  event.preventDefault();

  const projectTitle1 = document.getElementById("project-title").value;
  const taskName1 = document.getElementById("task-name").value;
  const description1 = document.getElementById("description").value;
  const assignedStudent1 = document.getElementById("assigned-student").value;
  const status1 = document.getElementById("status").value;
  const dueDate1 = document.getElementById("due-date").value;
  const projectId = document.getElementById("project-title").value;
  if (
    projectTitle1 === "Select a project" ||
    assignedStudent1 === "Select a student" ||
    status1 === "Select a status" ||
    taskName1.trim() === "" ||
    dueDate1.trim() === ""
  ) {
    alert("Enter Information Please");
    return;
  }

  let storedData = JSON.parse(localStorage.getItem("data"));
  let data = storedData.tasks;

  const newTask = {
    id: data.length + 1,
    description: description1,
    status: status1,
    assignedTo: +assignedStudent1,
    assignedBy: 1,
    projectId: +projectId,
    projectTitle: projectTitle1,
    createdAt: new Date().toISOString(),
    title: taskName1,
  };

  localStorage.setItem(
    "data",
    JSON.stringify({
      ...storedData,
      tasks: [...data, newTask],
    })
  );

  loadTasks();
  alert("Done!");

  document.querySelector(".close-btn").click();
};

function addProjectEventListener() {
  const openModalButtons = document.querySelectorAll("[data-modal-target]");
  const closeModalButtons = document.querySelectorAll("[data-close-button]");
  const overlay = document.getElementById("overlay");

  openModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = document.querySelector(button.dataset.modalTarget);
      openModal(modal);
    });
  });

  overlay.addEventListener("click", () => {
    const modals = document.querySelectorAll(".modal.active");
    modals.forEach((modal) => {
      closeModal(modal);
    });
  });

  closeModalButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const modal = button.closest(".modal");
      closeModal(modal);
    });
  });

  function openModal(modal) {
    if (modal == null) return;
    modal.classList.add("active");
    overlay.classList.add("active");
  }

  function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove("active");
    overlay.classList.remove("active");
  }
}

function search() {
  document
    .getElementById("searchProject")
    .addEventListener("input", function () {
      const searchQuery = this.value.toLowerCase(); // Get the search query and convert it to lowercase

      const localData = JSON.parse(localStorage.getItem("data"));

      // Get data from the database using the sub() function
      const dbData = JSON.parse(localStorage.getItem("projects")) || {
        projects: [],
      }; // You may need to replace this with an actual DB fetch if it's not stored in localStorage

      // Merge the projects from localStorage and database
      const allProjects = [
        ...(localData ? localData.projects : []),
        ...dbData.projects,
      ];

      // Check if there are projects to display
      if (allProjects.length === 0) {
        return;
      }

      // Filter the projects by both title and description based on the search query
      const filteredProjects = allProjects.filter((project) => {
        const matchesTitle = project.title.toLowerCase().includes(searchQuery);
        const matchesDescription = project.description
          .toLowerCase()
          .includes(searchQuery);
        return matchesTitle || matchesDescription; // Return true if either title or description matches
      });

      // Call a function to display the filtered projects
      displayFilteredProjects(filteredProjects);
    });
}

function selectStatus() {
  const selectedStatus = document.getElementById("status").value;
  const searchQuery = document
    .getElementById("searchProject")
    .value.toLowerCase();

  const localData = JSON.parse(localStorage.getItem("data"));

  const dbData = JSON.parse(localStorage.getItem("projects")) || {
    projects: [],
  };

  const allProjects = [
    ...(localData ? localData.projects : []),
    ...dbData.projects,
  ];

  if (allProjects.length === 0) {
    return;
  }

  const filteredProjects = allProjects.filter((project) => {
    const matchesStatus =
      selectedStatus === "AllStatuses" || project.status === selectedStatus;

    const matchesSearchQuery =
      project.title.toLowerCase().includes(searchQuery) ||
      project.description.toLowerCase().includes(searchQuery) ||
      project.students.some((student) =>
        student.toLowerCase().includes(searchQuery)
      );

    return matchesStatus && matchesSearchQuery;
  });

  displayFilteredProjects(filteredProjects);
}

function populateStudentList() {
  const studentContainer = document.getElementById("studentListContainer");

  let data = JSON.parse(localStorage.getItem("data")) || { users: [] };

  studentContainer.innerHTML = "";

  if (data.users && data.users.length > 0) {
    data.users.forEach((user) => {
      if (user.username === "adminUser") return; // Skip admin user

      let studentItem = document.createElement("div");
      studentItem.classList.add("student-item");
      studentItem.textContent = user.username;
      studentItem.dataset.value = user.id;

      studentItem.addEventListener("click", function () {
        studentItem.classList.toggle("selected");
      });

      studentContainer.appendChild(studentItem);
    });
  } else {
    studentContainer.innerHTML = "<p>No students available</p>";
  }
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  document.getElementById("overlay").classList.remove("active");
}

function sub() {
  //submit new project
  const title = document.querySelector("input[name='title']").value;
  const description = document.querySelector(
    "textarea[name='description']"
  ).value;

  // Get selected students from highlighted items
  const students = Array.from(
    document.querySelectorAll(".student-item.selected")
  ).map((item) => item.dataset.value);

  const category = document.getElementById("category").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const status = document.querySelector("select[name='status']").value;

  const data = JSON.parse(localStorage.getItem("data"));
  const project = {
    id: data.projects.length + 1,
    title: title,
    description: description,
    category: category,
    startDate: startDate,
    endDate: endDate,
    status: status,
    createdAt: new Date().toLocaleString(),
  };

  let projects = [...data.projects, project];

  const studentsProjects = students.map((studentId) => {
    return {
      studentId: +studentId,
      projectId: project.id,
    };
  });

  localStorage.setItem(
    "data",
    JSON.stringify({
      ...data,
      projects: [...projects],
      student_projects: [...data.student_projects, ...studentsProjects],
    })
  );

  document.getElementById("myForm").reset();

  document.querySelectorAll(".student-item.selected").forEach((item) => {
    item.classList.remove("selected");
  });

  const modal = document.getElementById("projectModal");
  closeModal(modal);

  showProjects();
}

function displayFilteredProjects(projects) {
  const maindivContainer = document.querySelector(".maindiv");

  maindivContainer.innerHTML = "";

  if (projects.length === 0) {
    const noResultsMessage = document.createElement("div");
    noResultsMessage.textContent = "No projects found!";
    maindivContainer.appendChild(noResultsMessage);
    return;
  }

  const { student_projects, users } = JSON.parse(localStorage.getItem("data"));
  projects.forEach((project, index) => {
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
    progressPercentage = Math.min(Math.max(progressPercentage, 0), 100); // Keep within range [0,100]

    const studentsIds = student_projects.filter(
      (stuProj) => stuProj.projectId === project.id
    );
    const studentsNames = [];
    studentsIds.forEach((stuProj) => {
      const student = users.find((user) => user.id === stuProj.studentId);
      studentsNames.push(student.username);
    });
    console.log(studentsNames);

    const projectDiv = document.createElement("div");
    projectDiv.className = `projectSec2 status-${project.status}`; // Add status class to each project div

    projectDiv.innerHTML = `
      <h3 id="projectTitle_${index}">${project.title}</h3>
      <p><strong>Description:</strong> <span id="projectDescription_${index}">${
      project.description
    }</span></p>
      <p><strong>Students:</strong><span id="projectStudents_${index}">${studentsNames.join(
      ", "
    )}</span></p>
      <p><strong>Category:</strong> <span id="projectCategory_${index}">${
      project.category
    }</span></p>
      <div class="progress-container">
          <div class="progress-bar"  >
              ${progressPercentage}%
          </div>
      </div>
      <div class="dates">
        <p id="projectCreatedAt_${index}">${project.startDate}</p>
        <p id="projectDeadline_${index}">${project.endDate}</p>
      </div> 
    `;

    maindivContainer.appendChild(projectDiv);
  });
}

function studentProj() {
  const { student_projects, projects } = JSON.parse(
    localStorage.getItem("data")
  );
  const user = JSON.parse(localStorage.getItem("user"));
  if (!projects || !student_projects) {
    return;
  }

  let studentProjects = [];
  student_projects.forEach((stuProj) => {
    if (stuProj.studentId === user.id) {
      const proj = projects.find((project) => project.id === stuProj.projectId);
      studentProjects.push(proj);
    }
  });

  // Get the container where projects will be displayed
  const container = document.getElementById("projectContainer");

  // Clear previous content
  container.innerHTML = "";

  // Populate projects
  studentProjects.forEach((project, index) => {
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const today = new Date();

    // Ensure time is ignored for correct date comparison
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);

    // Calculate total project duration in days
    const totalDuration = Math.max(
      (endDate - startDate) / (1000 * 60 * 60 * 24),
      1
    ); // Avoid division by zero

    // Calculate elapsed duration in days
    const elapsedDuration = Math.max(
      (today - startDate) / (1000 * 60 * 60 * 24),
      0
    );

    // Calculate progress percentage
    let progressPercentage = Math.round(
      (elapsedDuration / totalDuration) * 100
    );
    progressPercentage = Math.min(Math.max(progressPercentage, 0), 100); // Keep within [0,100]

    const projectDiv = document.createElement("div");
    projectDiv.classList.add("project-item");

    projectDiv.innerHTML = `
          <h3 id="projectTitle_${index}">${project.title}</h3>
          <p><strong>Description:</strong> <span>${project.description}</span></p>

          <p><strong>Category:</strong> <span>${project.category}</span></p>
          <div class="progress-container">
              <div class="progress-bar" style="width: ${progressPercentage}%;">
                  ${progressPercentage}%
              </div>
          </div>
          <div class="dates">
              <p><strong></strong> ${project.startDate}</p>
              <p><strong></strong> ${project.endDate}</p>
          </div> 
      `;

    container.appendChild(projectDiv);
  });
}

/////////////////////////////////////////

function taskproj(projectId) {
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

  // Display Project Info
  document.getElementById("project-title").textContent = project.title;
  document.getElementById("project-desc").textContent = project.description;
  document.getElementById("project-category").textContent = project.category;
  document.getElementById("project-students").textContent =
    studentsNames.join(", ");
  document.getElementById("project-start").textContent = project.startDate;
  document.getElementById("project-end").textContent = project.endDate;

  // Retrieve tasks from localStorage
  const tasksData = data.tasks || [];

  // Get related tasks for this project
  const projectTasks = tasksData.filter(
    (task) => task.projectId === project.id
  );

  // Display Tasks
  const tasksContainer = document.getElementById("tasks-container");
  tasksContainer.innerHTML = ""; // Clear previous data

  if (projectTasks.length === 0) {
    tasksContainer.innerHTML = "<p>No tasks found for this project.</p>";
    return;
  }

  projectTasks.forEach((task) => {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task-item");

    // Retrieve assigned student name
    const assignedUser = data.users.find((user) => user.id === task.assignedTo);

    taskDiv.innerHTML = `
         <p> <strong >Task ID:</strong> ${task.id} </p>
         <p> <strong >Task Name:</strong> ${task.title} </p>
         <p> <strong >Description:</strong> ${task.description} </p>
         <p> <strong>Assigned Student:</strong> ${
           assignedUser ? assignedUser.username : "Unknown"
         }
         <p> <strong>Status:</strong> ${task.status}</p>
      `;

    tasksContainer.appendChild(taskDiv);
  });
}

let activeProjectId = null; // Store the currently active project ID

function openTaskSidebar(projectId) {
  let sidebar = document.getElementById("task-sidebar");

  // If sidebar exists and the same project is clicked, close it
  if (
    sidebar &&
    sidebar.style.display === "block" &&
    activeProjectId === projectId
  ) {
    closeSidebar();
    activeProjectId = null;
    return;
  }

  // Update the active project ID
  activeProjectId = projectId;

  if (!sidebar) {
    sidebar = document.createElement("div");
    sidebar.id = "task-sidebar";
    sidebar.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            bottom:0;
            width: 25%;
            height: 100%;
              background-color:  #1e1e1e;
         border: 0.1px solid  gray;
          font-size:15px;
            overflow-y: auto;
            display: block;
        `;
    document.getElementById("content").appendChild(sidebar);
    //document.body.appendChild(sidebar);
  } else {
    sidebar.style.display = "block";
  }

  // Add a close button
  sidebar.innerHTML = `
        <div id="sidebar-content">Loading...</div>
    `;

  // Load the content dynamically
  fetch("pages/taskProject.html")
    .then((response) => response.text())
    .then((html) => {
      document.getElementById("sidebar-content").innerHTML = html;

      // Call taskproj with the correct project ID
      taskproj(projectId);
    })
    .catch((error) => {
      console.error("Error loading taskProject.html:", error);
      document.getElementById("sidebar-content").innerHTML =
        "<p>Error loading content.</p>";
    });
}

function closeSidebar() {
  const sidebar = document.getElementById("task-sidebar");
  if (sidebar) {
    sidebar.style.display = "none";
  }
  console.log("Sidebar closed.");
  activeProjectId = null; // Reset the active project ID
}

function showProjects() {
  const localData = JSON.parse(localStorage.getItem("data"));
  if (!localData || !localData.projects) {
    console.error("No project data found.");
    return;
  }

  const { projects, student_projects, users } = localData;
  const maindivContainer = document.querySelector(".maindiv");
  maindivContainer.innerHTML = "";

  projects.forEach((project, index) => {
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

    const studentsIds = student_projects.filter(
      (stuProj) => stuProj.projectId === project.id
    );
    const studentsNames = studentsIds.map((stuProj) => {
      const student = users.find((user) => user.id === stuProj.studentId);
      return student ? student.username : "Unknown";
    });

    const projectDiv = document.createElement("div");
    projectDiv.className = `projectSec2 status-${project.status}`;
    projectDiv.setAttribute("data-project-id", project.id);

    projectDiv.innerHTML = `
      <h3 id="projectTitle_${index}">${project.title}</h3>
      <p><strong>Description:</strong> <span id="projectDescription_${index}">${
      project.description
    }</span></p>
      <p><strong>Students:</strong> <span id="projectStudents_${index}">${studentsNames.join(
      ", "
    )}</span></p>
      <p><strong>Category:</strong> <span id="projectCategory_${index}">${
      project.category
    }</span></p>
      <div class="progress-container">
        <div class="progress-bar" style="width: ${progressPercentage}%">${progressPercentage}%</div>
      </div>
      <div class="dates">
        <p id="projectCreatedAt_${index}">${project.startDate}</p>
        <p id="projectDeadline_${index}">${project.endDate}</p>
      </div> 
    `;

    projectDiv.addEventListener("click", function () {
      openTaskSidebar(project.id);
    });

    maindivContainer.appendChild(projectDiv);
  });

  console.log("Projects loaded successfully.");
}
