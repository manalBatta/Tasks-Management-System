const updateTime = () => {
  const now = new Date();
  const formattedTime = now.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  try {
    document.querySelector(".real-time-display").textContent = formattedTime;
  } catch (err) {
    console.log(
      "It's ok the document is not loaded yet to write real time",
      err
    );
  }
};

const loadChart = () => {
  const ctx = document.getElementById("myChart");
  console.log(ctx);
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Projects", "Students", "Tasks", "Finished Projects"],
      datasets: [
        {
          label: "# of Votes",
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};
// Update time every second
setInterval(updateTime, 1000);
updateTime();
