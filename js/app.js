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
        id: 1,
        title: "Data Collection",
        description: "Gather historical weather data.",
        status: "Pending",
        assignedTo: 2,
        assignedBy: 1,
        projectId: 1,
        projectTitle: "AI Research",
        createdAt: "2024-02-26T12:00:00Z",
      },
      {
        id: 2,
        title: "UI Design",
        description: "Create a responsive UI for the web app.",
        status: "In Progress",
        assignedTo: 3,
        assignedBy: 1,
        projectId: 2,
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

  localStorage.setItem("data", JSON.stringify(mockData));
})();
