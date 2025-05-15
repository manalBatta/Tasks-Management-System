import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const HomeChart = ({ data }) => {
  const chartData = {
    labels: ["Projects", "Students", "Tasks", "Finished Projects"],
    datasets: [
      {
        label: "Count",
        data: [
          data.projectsCount,
          data.studentsCount,
          data.tasksCount,
          data.finishedProjectsCount,
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
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Admin Dashboard Overview",
        color: "#fff",
      },
      legend: {
        labels: {
          color: "#fff",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#fff",
        },
      },
      x: {
        ticks: {
          color: "#fff",
        },
      },
    },
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default HomeChart;
