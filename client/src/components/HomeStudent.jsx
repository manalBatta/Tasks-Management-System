import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const HomeStudent = () => {
  const { user } = useAuth();
  const [tasksCount, setTasksCount] = useState(0);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("http://localhost:3000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                tasks {
                  id
                  assignedTo {
                    id
                  }
                }
              }
            `,
          }),
        });
        const result = await res.json();
        if (result.data && result.data.tasks) {
          const count = result.data.tasks.filter(
            (task) => task.assignedTo && task.assignedTo.id === user.id
          ).length;
          setTasksCount(count);
        }
      } catch (error) {
        setTasksCount(0);
      }
    };
    if (user && user.id) fetchTasks();
  }, [user]);

  return (
    <main className="w-full h-full flex flex-col gap-1">
      <section className="min-h-[10%] flex justify-between items-center p-[1%]">
        <h2 className="text-blue-500">Welcome to the Task Management system</h2>
        <h3 className="text-sm font-light"></h3>
      </section>

      <div className="bg-[#393939] rounded-xl min-w-[133px] h-[100px] p-[3%] flex justify-start items-center shadow-md text-xl">
        You have: <br />
        <span
          id="StudentTasksCount"
          className="text-blue-500 font-semibold text-2xl ml-3"
        >
          {tasksCount}
        </span>
        Tasks
      </div>
    </main>
  );
};

export default HomeStudent;
