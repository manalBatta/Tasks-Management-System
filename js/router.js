const mainRoute = async (isLogged) => {
  const index = document.getElementById("app");
  try {
    const response = await fetch(isLogged ? "dashboard.html" : "signin.html");
    const html = await response.text();
    index.innerHTML = html;
    dashboardRout("home"); //By default display the home page
  } catch (error) {
    console.error("Error fetching the page:", error);
  }
};

const dashboardRout = async (page) => {
  const index = document.getElementById("content");
  try {
    const response = await fetch(`../pages/${page}.html`);
    const html = await response.text();
    index.innerHTML = html;
  } catch (error) {
    console.error("Error fetching the page:", error);
  }
};

mainRoute(true);
