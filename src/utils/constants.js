export const formatTime = (timestamp) => {
  try {
    if (!timestamp) {
      console.warn("Empty timestamp received");
      return "";
    }
    // Handle 12-hour format
    if (
      typeof timestamp === "string" &&
      /^\d{1,2}:\d{2}:\d{2}\s[AP]M$/.test(timestamp)
    ) {
      const [time, period] = timestamp.split(" ");
      const [hours, minutes, seconds] = time.split(":");
      let hour = parseInt(hours);

      if (period === "PM" && hour < 12) hour += 12;
      if (period === "AM" && hour === 12) hour = 0;

      return `${hour.toString().padStart(2, "0")}:${minutes}:${seconds}`;
    }

    // Handle PostgreSQL timestamp
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      console.error("Invalid timestamp:", timestamp);
      return "";
    }

    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "";
  }
};
