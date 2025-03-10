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









// Call the function to attach the event listener



let chatContact;
const loadContacts = () => {
  const contacts = JSON.parse(localStorage.getItem("data")).users;

  const list = document.getElementById("contacts-list");
  contacts.forEach((contact) => {
    const li = `<li class="contact-item" onclick="loadChat(${contact.id})">${contact.username}</li>`;
    list.innerHTML += li;
  });
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
    const messagesList = document.getElementById("messages-list");

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
        title: "Website Redesign",
        description: " Redesign the company website to improve user experience.",
        createdBy: 1,
        startDate: "2024-01-01",
        endDate: "2024-06-21",
        status: "InProgress",
        students:[ "SalahSalah , IsaacNasi" ],
        category:"Mobile Development",
              
      },
      {
        id: 2,
        title: "Mobile App Development",
        description: "Develop a mobile application for our services.",
        createdBy: 1,
        startDate: "2024-02-15",
        endDate: "2024-08-15",
        status: "Completed",
        students:["IsaacNasir"],
        category:"Mobile Development",
      },

      {
        id: 3,
        title: "Data Analysis Project",
        description: "Analyze data from the last quarter to find insights.",
        createdBy: 1,
        startDate: "2024-03-01",
        endDate: "2024-05-01",
        status: "Pending",
        students:["SaeedSalam, YahyaLeader"],
        category:"Data Science",
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





function addProjectEventListener() {
 

    const openModalButtons = document.querySelectorAll('[data-modal-target]')
    const closeModalButtons = document.querySelectorAll('[data-close-button]')
    const overlay = document.getElementById('overlay')
    
    openModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
      })
    })
    
    overlay.addEventListener('click', () => {
      const modals = document.querySelectorAll('.modal.active')
      modals.forEach(modal => {
        closeModal(modal)
      })
    })
    
    closeModalButtons.forEach(button => {
      button.addEventListener('click', () => {
        const modal = button.closest('.modal')
        closeModal(modal)
      })
    })
    
    function openModal(modal) {
      if (modal == null) return
      modal.classList.add('active')
      overlay.classList.add('active')
    }
    
    function closeModal(modal) {
      if (modal == null) return
      modal.classList.remove('active')
      overlay.classList.remove('active')
    }
  
  
}















function search(){
  document.getElementById("searchProject").addEventListener("input", function() {
    const searchQuery = this.value.toLowerCase(); // Get the search query and convert it to lowercase

    const localData = JSON.parse(localStorage.getItem("data"));

    // Get data from the database using the sub() function
    const dbData = JSON.parse(localStorage.getItem("projects")) || { projects: [] }; // You may need to replace this with an actual DB fetch if it's not stored in localStorage
  
    // Merge the projects from localStorage and database
    const allProjects = [...(localData ? localData.projects : []), ...dbData.projects];
  
    // Check if there are projects to display
    if (allProjects.length === 0) {
      console.error("No project data found.");
      return;
    }
  

    // Filter the projects by both title and description based on the search query
    const filteredProjects = allProjects.filter(project => {
      const matchesTitle = project.title.toLowerCase().includes(searchQuery);
      const matchesDescription = project.description.toLowerCase().includes(searchQuery);
      return matchesTitle || matchesDescription; // Return true if either title or description matches
    });

    // Call a function to display the filtered projects
    displayFilteredProjects(filteredProjects);
  });
}










function selectStatus() {



  const selectedStatus = document.getElementById("status").value;  // Get the selected status from the dropdown
  const searchQuery = document.getElementById("searchProject").value.toLowerCase();  // Get the current search query





  const localData = JSON.parse(localStorage.getItem("data"));

  // Get data from the database using the sub() function
  const dbData = JSON.parse(localStorage.getItem("projects")) || { projects: [] }; // You may need to replace this with an actual DB fetch if it's not stored in localStorage

  // Merge the projects from localStorage and database
  const allProjects = [...(localData ? localData.projects : []), ...dbData.projects];

  // Check if there are projects to display
  if (allProjects.length === 0) {
    console.error("No project data found.");
    return;
  }

  // Filter the projects based on status and search query
  const filteredProjects = allProjects.filter(project => {
    const matchesStatus = selectedStatus === "AllStatuses" || project.status === selectedStatus;

    const matchesSearchQuery = project.title.toLowerCase().includes(searchQuery) ||
                               project.description.toLowerCase().includes(searchQuery) ||
                               project.students.some(student => student.toLowerCase().includes(searchQuery));
                      
    return matchesStatus && matchesSearchQuery;
  });

  // Call a function to display the filtered projects
  displayFilteredProjects(filteredProjects);
}



 


function populateStudentList() {
  const studentContainer = document.getElementById("studentListContainer");

  // Retrieve students from localStorage
  let data = JSON.parse(localStorage.getItem("data")) || { users: [] };

  // Clear existing items
  studentContainer.innerHTML = "";

  if (data.users && data.users.length > 0) {
      data.users.forEach(user => {
          if (user.username === "adminUser") return; // Skip admin user

          // Create student item (styled like a select option)
          let studentItem = document.createElement("div");
          studentItem.classList.add("student-item");
          studentItem.textContent = user.username;
          studentItem.dataset.value = user.username; // Store value for retrieval

          // Handle click for selection
          studentItem.addEventListener("click", function () {
              studentItem.classList.toggle("selected");
          });

          studentContainer.appendChild(studentItem);
      });
  } else {
      studentContainer.innerHTML = "<p>No students available</p>";
  }
}



// Define closeModal globally
function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
}






function sub() {     
  // Get form values
  const title = document.querySelector("input[name='title']").value;
  const description = document.querySelector("textarea[name='description']").value;

  // Get selected students from highlighted items
  const students = Array.from(document.querySelectorAll(".student-item.selected"))
      .map(item => item.dataset.value);

  const category = document.getElementById("category").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  const status = document.querySelector("select[name='status']").value;

  // Create project object
  const project = {
      title,
      description,
      students,
      category,
      startDate,
      endDate,
      status,
      createdAt: new Date().toLocaleString()
  };

  // Get existing projects or create new empty array
  let projects = JSON.parse(localStorage.getItem("projects")) || { projects: [] };

  console.log("Existing projects:", projects.projects);

  // Add new project to the projects array
  projects.projects.push(project);

  // Save the updated projects array back to localStorage under "projects"
  localStorage.setItem("projects", JSON.stringify(projects));

  // Clear form after submission
  document.getElementById("myForm").reset();

  // Remove selection from student list
  document.querySelectorAll(".student-item.selected").forEach(item => {
      item.classList.remove("selected");
  });

  // Close modal using closeModal function
  const modal = document.getElementById("projectModal");
  closeModal(modal); 

  console.log("Project added successfully.");

  // Optionally, call a function to display projects on the UI (if necessary)
  // appendProjectToUI(project);

  // Show updated list of projects
  showProjects();
}







function showProjects() {
  // Get data from localStorage
  const localData = JSON.parse(localStorage.getItem("data"));

  // Get data from the database using the sub() function
  const dbData = JSON.parse(localStorage.getItem("projects")) || { projects: [] }; // You may need to replace this with an actual DB fetch if it's not stored in localStorage

  // Merge the projects from localStorage and database
  const allProjects = [...(localData ? localData.projects : []), ...dbData.projects];

  // Check if there are projects to display
  if (allProjects.length === 0) {
    console.error("No project data found.");
    return;
  }

  const maindivContainer = document.querySelector(".maindiv");
  maindivContainer.innerHTML = "";

  allProjects.forEach((project, index) => {
    // Parse the start and end dates
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const today = new Date();

    // Ensure time is ignored (only date comparison)
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);

    // Calculate total project duration in days
    const totalDuration = Math.max((endDate - startDate) / (1000 * 60 * 60 * 24), 1); // Avoid division by zero

    // Calculate elapsed duration in days
    const elapsedDuration = Math.max((today - startDate) / (1000 * 60 * 60 * 24), 0);

    let progressPercentage = Math.round((elapsedDuration / totalDuration) * 100);
    progressPercentage = Math.min(Math.max(progressPercentage, 0), 100); // Keep within range [0,100]

    const projectDiv = document.createElement("div");
    projectDiv.className = `projectSec2 status-${project.status}`;

    projectDiv.innerHTML = `
      <h3 id="projectTitle_${index}">${project.title}</h3>
      <p><strong>Description:</strong> <span id="projectDescription_${index}">${project.description}</span></p>
      <p><strong>Students:</strong> <span id="projectStudents_${index}">${project.students.join(", ")}</span></p>
      <p><strong>Category:</strong> <span id="projectCategory_${index}">${project.category}</span></p>
      <div class="progress-container">
        <div class="progress-bar">${progressPercentage}%</div>
      </div>
      <div class="dates">
        <p id="projectCreatedAt_${index}">${project.startDate}</p>
        <p id="projectDeadline_${index}">${project.endDate}</p>
      </div> 
    `;

    maindivContainer.appendChild(projectDiv);
  });

  console.log("Projects loaded successfully.");
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

  projects.forEach((project, index) => {
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const today = new Date();

    // Ensure time is ignored (only date comparison)
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);
    today.setHours(0, 0, 0, 0);

    // Calculate total project duration in days
    const totalDuration = Math.max((endDate - startDate) / (1000 * 60 * 60 * 24), 1); // Avoid division by zero

    // Calculate elapsed duration in days
    const elapsedDuration = Math.max((today - startDate) / (1000 * 60 * 60 * 24), 0);

    // Calculate progress percentage
    let progressPercentage = Math.round((elapsedDuration / totalDuration) * 100);
    progressPercentage = Math.min(Math.max(progressPercentage, 0), 100); // Keep within range [0,100]

    const projectDiv = document.createElement("div");
    projectDiv.className = `projectSec2 status-${project.status}`; // Add status class to each project div

    projectDiv.innerHTML = `
      <h3 id="projectTitle_${index}">${project.title}</h3>
      <p><strong>Description:</strong> <span id="projectDescription_${index}">${project.description}</span></p>
      <p><strong>Students:</strong> <span id="projectStudents_${index}">${project.students.join(", ")}</span></p>
      <p><strong>Category:</strong> <span id="projectCategory_${index}">${project.category}</span></p>
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
  // Retrieve data from local storage
  const data = JSON.parse(localStorage.getItem("data"));

  if (!data || !data.projects) {
      console.error("No project data found.");
      return;
  }

  // Filter projects where YahyaLeader is a student
  const yahyaProjects = data.projects.filter(project => 
      project.students.some(student => student.includes("YahyaLeader"))
  );

  // Get the container where projects will be displayed
  const container = document.getElementById("projectContainer");

  // Clear previous content
  container.innerHTML = "";

  // Populate projects
  yahyaProjects.forEach((project, index) => {
      const startDate = new Date(project.startDate);
      const endDate = new Date(project.endDate);
      const today = new Date();

      // Ensure time is ignored for correct date comparison
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      today.setHours(0, 0, 0, 0);

      // Calculate total project duration in days
      const totalDuration = Math.max((endDate - startDate) / (1000 * 60 * 60 * 24), 1); // Avoid division by zero

      // Calculate elapsed duration in days
      const elapsedDuration = Math.max((today - startDate) / (1000 * 60 * 60 * 24), 0);

      // Calculate progress percentage
      let progressPercentage = Math.round((elapsedDuration / totalDuration) * 100);
      progressPercentage = Math.min(Math.max(progressPercentage, 0), 100); // Keep within [0,100]

      const projectDiv = document.createElement("div");
      projectDiv.classList.add("project-item");

      projectDiv.innerHTML = `
          <h3 id="projectTitle_${index}">${project.title}</h3>
          <p><strong>Description:</strong> <span>${project.description}</span></p>
          <p><strong>Students:</strong> <span>${project.students.join(", ")}</span></p>
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
