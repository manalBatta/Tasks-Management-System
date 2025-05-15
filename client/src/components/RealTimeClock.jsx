import { useEffect, useState } from "react";

const RealTimeClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => setTime(new Date()), 1000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = time.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return <span className="real-time-display">{formattedTime}</span>;
};

export default RealTimeClock;
