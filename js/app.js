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

const highlightSelectedPageLink = (target) => {
  const linksListElements = document.getElementsByClassName("sidebar-item");
  for (let i = 0; i < linksListElements.length; i++)
    linksListElements.item(i).classList.remove("selected");
  target.classList.toggle("selected");
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

    console.log("Selected value:", this.value);

    if (this.value === "Due Date") {
      // console.log("Parsed dates: Due date ");
      rows.sort((a, b) => {
        let dateA = parseDate(a.cells[6].textContent.trim());
        let dateB = parseDate(b.cells[6].textContent.trim());
        console.log(
          "Raw text dates:",
          a.cells[6].textContent.trim(),
          b.cells[6].textContent.trim()
        );

        return dateB - dateA;
      });

      rows.forEach((row) => table.querySelector("tbody").appendChild(row));
    } else if (this.value === "Project") {
      //console.log("Sorting by Project Name...");

      rows.sort((a, b) => {
        let projectA = a.cells[1].textContent.trim();
        let projectB = b.cells[1].textContent.trim();

        if (projectA === projectB) {
          return 0;
        }

        return projectA.localeCompare(projectB);
      });

      rows.forEach((row) => table.querySelector("tbody").appendChild(row));
      //console.log("Sorting completed by Project Name!");
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
      //console.log("Sorting completed by Assigned Student!");
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

  //console.log("Clicked on:", currentStatus);

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
  cell.setAttribute("data-status", nextStatus);
  cell.classList.remove(
    "status-pending",
    "status-inprogress",
    "status-completed",
    "status-onHold",
    "status-cancled"
  );
  cell.classList.add(getStatusClass(nextStatus));

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
  console.log("Adding new task...");
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

  console.log("New Task:", newTask);
  loadTasks();
  alert("Done!");

  document.querySelector(".close-btn").click();
};

//intialization
(function () {
  const mockData = {
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
        title: "AI Research",
        description: "Developing an AI model for predicting weather patterns.",
        createdBy: 1,
        createdAt: "2024-02-01T10:00:00Z",
        deadline: "2024-03-01T23:59:59Z",
        status: "In Progress",
      },
      {
        id: 2,
        title: "Web App Development",
        description: "Building a task management system.",
        createdBy: 1,
        createdAt: "2024-01-15T11:00:00Z",
        deadline: "2024-02-15T23:59:59Z",
        status: "Completed",
      },
    ],
    tasks: [
      {
        id: 10,
        title: "Data Collection",
        description: "Gather historical weather data.",
        status: "Pending",
        assignedTo: 2,
        assignedBy: 1,
        projectId: 1,
        createdAt: "2024-02-26T12:00:00Z",
      },
      {
        id: 11,
        title: "UI Design",
        description: "Create a responsive UI for the web app.",
        status: "In Progress",
        assignedTo: 3,
        assignedBy: 1,
        projectId: 2,
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
  if (localStorage.key("data") === null) {
    localStorage.setItem("data", JSON.stringify(mockData));
  }
})();
