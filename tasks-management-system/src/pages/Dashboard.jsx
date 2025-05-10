import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Home from "../components/Home";
import HomeStudent from "../components/HomeStudent";
import Chat from "../components/Chat";
import Tasks from "../components/Tasks";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeView, setActiveView] = useState("home");

  const dashboardRout = (view) => {
    setActiveView(view);
  };

  const renderContent = () => {
    switch (activeView) {
      case "home":
        if (user?.role === "admin") {
          return <Home></Home>;
        } else {
          return <HomeStudent></HomeStudent>;
        }
      case "projects":
        if (user?.role === "admin") {
          return <div>Admin projects</div>;
        } else {
          return <div>Student projects</div>;
        }
      case "tasks":
        return <Tasks></Tasks>;
      case "chat":
        return <Chat></Chat>;
      default:
        return <div>Not Found</div>;
    }
  };

  return (
    <main
      className="h-full w-full bg-[#1e1e1e] text-white"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 4fr",
        gridTemplateRows: "0.5fr 5fr",
        gridTemplateAreas: "'header header' 'sidebar content'",
      }}
    >
      <header
        className="flex justify-end items-center m-2 p-2 items-center pr-2 gap-2 text-lg border-b-2 border-[#9b9b9bb2]"
        style={{ gridArea: "header" }}
      >
        <h1 id="userName">{user?.username || "User"}</h1>
        <button
          className="bg-red-600 text-white rounded-lg py-1 px-2 border-none w-[92px] cursor-pointer hover:bg-red-500 text-xl"
          onClick={logout}
        >
          Logout
        </button>
      </header>
      <aside
        className="bg-[#2a2a2a] border-r-2 border-[#9b9b9bb2]"
        style={{ gridArea: "sidebar" }}
      >
        <ul className="list-none p-4">
          <li
            className={`mb-2 py-3 pl-5 text-xl rounded-md cursor-pointer ${
              activeView === "home" ? "bg-blue-500" : "bg-[#444444]"
            }`}
            onClick={() => dashboardRout("home")}
          >
            Home
          </li>
          <li
            className={`mb-2 py-3 pl-5 text-xl rounded-md cursor-pointer ${
              activeView === "projects" ? "bg-blue-500" : "bg-[#444444]"
            }`}
            onClick={() => dashboardRout("projects")}
          >
            Projects
          </li>
          <li
            className={`mb-2 py-3 pl-5 text-xl rounded-md cursor-pointer ${
              activeView === "tasks" ? "bg-blue-500" : "bg-[#444444]"
            }`}
            onClick={() => dashboardRout("tasks")}
          >
            Tasks
          </li>
          <li
            className={`mb-2 py-3 pl-5 text-xl rounded-md cursor-pointer ${
              activeView === "chat" ? "bg-blue-500" : "bg-[#444444]"
            }`}
            onClick={() => dashboardRout("chat")}
          >
            Chat
          </li>
        </ul>
      </aside>
      <section className="p-1" style={{ gridArea: "content" }}>
        {renderContent()}
      </section>
    </main>
  );
};

export default Dashboard;
