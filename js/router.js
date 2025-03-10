
let interval; //a global variable to store the interval for the home page real time clock

const mainRoute = async (page) => {
  const index = document.getElementById("app");
  try {
    const response = await fetch(`${page}.html`);
    const html = await response.text();
    index.innerHTML = html;
    if (page == "dashboard") dashboardRout("home");
    else if (page == "dashboardStudentView") dashboardRout("homeStudentView");
  } catch (error) {
    console.error("Error fetching the page:", error);
  }
};

const dashboardRout = async (page, event) => {
  const index = document.getElementById("content");
  const userName = document.getElementById("userName");
  const user = JSON.parse(localStorage.getItem("user"));
  userName.innerHTML = user.username;
  try {
    const response = await fetch(`../pages/${page}.html`);
    const html = await response.text();
    index.innerHTML = html;
    clearInterval(interval);
    if (page === "home") interval = homeIntialize();
    else if (page === "homeStudentView") interval = homeStudentIntialize();
    else if (page == "chat") loadContacts();
    else if (page == "tasks") loadTasks();
    highlightSelectedPageLink(event.target);
  } catch (error) {
    console.error("Error fetching the page:", error);
  }
};

mainRoute("pages/signin");
