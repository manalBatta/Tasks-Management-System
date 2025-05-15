import { useEffect, useState } from "react";
import RealTimeClock from "./RealTimeClock";
import HomeChart from "./HomeChart";

const Home = () => {
  const [stats, setStats] = useState({
    projectsCount: 0,
    studentsCount: 0,
    tasksCount: 0,
    finishedProjectsCount: 0,
  });

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("data"));
    const projectsCount = data.projects.length;
    const studentsCount = data.users.filter(
      (user) => user.role === "student"
    ).length;
    const tasksCount = data.tasks.length;
    const finishedProjectsCount = data.projects.filter(
      (p) => p.status === "Completed"
    ).length;

    setStats({
      projectsCount,
      studentsCount,
      tasksCount,
      finishedProjectsCount,
    });
  }, []);
  let chartInstance = null;

  useEffect(() => {
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  return (
    <main className="w-full h-full flex flex-col gap-1">
      <section className="min-h-[10%] flex justify-between items-center p-[1%]">
        <h2 className="text-blue-500">Welcome to the Task Management system</h2>
        <h3 className="text-sm font-light"></h3>
        <RealTimeClock />
      </section>

      <section className="flex px-[2.5%] text-white justify-around items-center min-h-[20%]">
        <div className="bg-[#393939] rounded-xl w-[18%] min-w-[133px] max-w-[300px] h-full p-[3%] flex justify-center items-center flex-col text-center shadow-md transition-all duration-300 ease-in-out hover:bg-[#2c2c2c] hover:rounded-full">
          Number of Projects <br />
          <span id="projectsCount"></span>
        </div>
        <div className="bg-[#393939] rounded-xl w-[18%] min-w-[133px] max-w-[300px] h-full p-[3%] flex justify-center items-center flex-col text-center shadow-md transition-all duration-300 ease-in-out hover:bg-[#2c2c2c] hover:rounded-full">
          Number of Students <br />
          <span id="studentsCount"></span>
        </div>
        <div className="bg-[#393939] rounded-xl w-[18%] min-w-[133px] max-w-[300px] h-full p-[3%] flex justify-center items-center flex-col text-center shadow-md transition-all duration-300 ease-in-out hover:bg-[#2c2c2c] hover:rounded-full">
          Number of Tasks <br />
          <span id="tasksCount"></span>
        </div>
        <div className="bg-[#393939] rounded-xl w-[18%] min-w-[133px] max-w-[300px] h-full p-[3%] flex justify-center items-center flex-col text-center shadow-md transition-all duration-300 ease-in-out hover:bg-[#2c2c2c] hover:rounded-full">
          Number of Finished Projects <br />
          <span id="finishedProjectsCount"></span>
        </div>
      </section>

      <div className="w-full min-h-[66%] h-auto">
        <div className="h-full w-full">
          <HomeChart data={stats} />
        </div>
      </div>
    </main>
  );
};

export default Home;
