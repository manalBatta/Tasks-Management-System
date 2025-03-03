let interval; //a global variable to store the interval for the home page real time clock

const mainRoute = async (page) => {
  const index = document.getElementById("app");
  try {
    const response = await fetch(`${page}.html`);
    const html = await response.text();
    index.innerHTML = html;
    if (page == "dashboard") dashboardRout("home");
  } catch (error) {
    console.error("Error fetching the page:", error);
  }
};

const dashboardRout = async (page, event) => {
  const index = document.getElementById("content");
  try {
    const response = await fetch(`../pages/${page}.html`);
    const html = await response.text();
    index.innerHTML = html;
    clearInterval(interval);
    if (page === "home") interval = homeIntialize();
    else if (page == "chat") loadContacts();
    highlightSelectedPageLink(event.target);
  } catch (error) {
    console.error("Error fetching the page:", error);
  }
};

const homeIntialize = () => {
  loadChart();
  updateTime();
  return setInterval(updateTime, 1000);
};

mainRoute("pages/signin");
