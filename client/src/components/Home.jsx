
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            query {
              dashboardStats {
                projectsCount
                studentsCount
                tasksCount
                finishedProjectsCount
              }
            }
          `,
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch dashboard stats");

      const { data, errors } = await response.json();

      if (errors) throw new Error(errors.map((e) => e.message).join(", "));

      setStats(data.dashboardStats);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
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

      {loading ? (
        <div className="text-white text-center p-4">Loading dashboard data...</div>
      ) : error ? (
        <div className="text-red-500 text-center p-4">Error: {error}</div>
      ) : (
        <>
          <section className="flex px-[2.5%] text-white justify-around items-center min-h-[20%]">
            <div className="bg-[#393939] rounded-xl w-[18%] min-w-[133px] max-w-[300px] h-full p-[3%] flex justify-center items-center flex-col text-center shadow-md transition-all duration-300 ease-in-out hover:bg-[#2c2c2c] hover:rounded-full">
              Number of Projects <br />
              <span id="projectsCount">{stats.projectsCount}</span>
            </div>
            <div className="bg-[#393939] rounded-xl w-[18%] min-w-[133px] max-w-[300px] h-full p-[3%] flex justify-center items-center flex-col text-center shadow-md transition-all duration-300 ease-in-out hover:bg-[#2c2c2c] hover:rounded-full">
              Number of Students <br />
              <span id="studentsCount">{stats.studentsCount}</span>
            </div>
            <div className="bg-[#393939] rounded-xl w-[18%] min-w-[133px] max-w-[300px] h-full p-[3%] flex justify-center items-center flex-col text-center shadow-md transition-all duration-300 ease-in-out hover:bg-[#2c2c2c] hover:rounded-full">
              Number of Tasks <br />
              <span id="tasksCount">{stats.tasksCount}</span>
            </div>
            <div className="bg-[#393939] rounded-xl w-[18%] min-w-[133px] max-w-[300px] h-full p-[3%] flex justify-center items-center flex-col text-center shadow-md transition-all duration-300 ease-in-out hover:bg-[#2c2c2c] hover:rounded-full">
              Number of Finished Projects <br />
              <span id="finishedProjectsCount">{stats.finishedProjectsCount}</span>
            </div>
          </section>

          <div className="w-full min-h-[66%] h-auto">
            <div className="h-full w-full">
              <HomeChart data={stats} />
            </div>
          </div>
        </>
      )}
    </main>
  );
};

export default Home;
