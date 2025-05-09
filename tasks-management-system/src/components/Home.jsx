import { useEffect } from "react";
import RealTimeClock from "./RealTimeClock";

const Home = () => {
  let chartInstance = null;

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

    // Destroy the existing chart instance if it exists
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Create a new chart instance
    chartInstance = new Chart(ctx, {
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

  useEffect(() => {
    loadChart();

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
        <canvas id="myChart" className="!w-full h-full"></canvas>
      </div>
    </main>
  );
};

export default Home;
