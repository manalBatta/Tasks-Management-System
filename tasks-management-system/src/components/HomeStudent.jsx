import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const HomeStudent = () => {
  const { user } = useAuth();
  const homeStudentIntialize = () => {
    const data = JSON.parse(localStorage.getItem("data"));
    const userId = user.id;
    const tasksCount = data.tasks.filter(
      (task) => task.assignedTo === userId
    ).length;
    document.getElementById("StudentTasksCount").textContent = tasksCount;
  };

  useEffect(() => {
    homeStudentIntialize();
  }, []);

  return (
    <main class="w-full h-full flex flex-col gap-1">
      <section class="min-h-[10%] flex justify-between items-center p-[1%]">
        <h2 class="text-blue-500">Welcome to the Task Management system</h2>
        <h3 class="text-sm font-light"></h3>
      </section>

      <div class="bg-[#393939] rounded-xl min-w-[133px] h-[100px] p-[3%] flex justify-start items-center shadow-md text-xl">
        You have: <br />
        <span
          id="StudentTasksCount"
          class="text-blue-500 font-semibold text-2xl ml-3"
        ></span>
        Tasks
      </div>
    </main>
  );
};

export default HomeStudent;
