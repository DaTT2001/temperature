import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { useTable } from "../context/TableContext";

// Đăng ký thành phần Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function TemperatureChart({ data, darkMode, timeRange }) {
  // Kiểm tra nếu `data` không tồn tại
  const { selectedTable } = useTable();
    
  const safeData = Array.isArray(data) ? data : [];
  const chartData = {
    labels: safeData.map(row => 
      row.timestamp
    ), // Chuyển timestamp từ giây sang GMT+7
    datasets: [
      {
        label: "Sensor 1",
        data: safeData.map(row => row.sensor1_temperature),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false, // Chỉ hiển thị đường, không cần vùng màu
      },
      {
        label: "Sensor 2",
        data: safeData.map(row => row.sensor2_temperature),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: false,
      },
      {
        label: "Sensor 3",
        data: safeData.map(row => row.sensor3_temperature),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
      {
        label: "Sensor 4",
        data: safeData.map(row => row.sensor4_temperature),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        fill: false,
      },
      {
        label: "Sensor 5",
        data: safeData.map(row => row.sensor5_temperature),
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: false,
      },
      {
        label: "Sensor 6",
        data: safeData.map(row => row.sensor6_temperature),
        borderColor: "rgba(0, 128, 0, 1)", // Màu xanh lá
        backgroundColor: "rgba(0, 128, 0, 0.2)",
        fill: false,
      },
    ],
  };

  const isDark = darkMode ?? false;
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: isDark ? "#ffffff" : "#000000",
        },
      },
      title: {
        display: true,
        text: `TEMPERATURE DATA ${selectedTable.toUpperCase()} ${
          timeRange.startTime && timeRange.endTime
            ? `FROM ${new Date(timeRange.startTime).toLocaleString("vi-VN", { timeZone: "Asia/Bangkok" }).toUpperCase()} TO ${new Date(timeRange.endTime).toLocaleString("vi-VN", { timeZone: "Asia/Bangkok" }).toUpperCase()}`
            : ""
        }`,
        color: darkMode ? "white" : "black",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      
    },
    scales: {
      x: {
        ticks: { color: isDark ? "#ffffff" : "#000000" },
        grid: { color: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)" },
      },
      y: {
        ticks: { color: isDark ? "#ffffff" : "#000000" },
        grid: { color: isDark ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.1)" },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} height={400} />;
}

export default TemperatureChart;
