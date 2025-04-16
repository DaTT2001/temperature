import React from "react";
import { Card } from "react-bootstrap";
import { useRealtimeStore } from "../services/realtimeStore";
import { useNavigate } from "react-router-dom";
import useLanguageStore from "../services/languageStore"; // Import Zustand store

const locales = {
  vi: {
    title: "NHIỆT ĐỘ",
    loading: "Đang chờ dữ liệu...",
    pidSensor: "Bộ điều khiển",
    rexSensor: "Cảm biến",
    chinoAvg: "Nhiệt độ Trung bình",
    updated: "Cập nhật lúc",
    noData: "N/A",
  },
  en: {
    title: "TEMPERATURE",
    loading: "Loading data...",
    pidSensor: "Controller",
    rexSensor: "Sensor",
    chinoAvg: "Average",
    updated: "Updated at",
    noData: "N/A",
  },
  zh: {
    title: "溫度",
    loading: "加載數據...",
    pidSensor: "控制器",
    rexSensor: "傳感器",
    chinoAvg: "平均溫度",
    updated: "更新於",
    noData: "無數據",
  },
};
const furnaces = [
  { id: "t4", name: "T4" },
  { id: "t5", name: "T5" },
  { id: "g1", name: "1600T" },
  { id: "g2", name: "1000T" },
  { id: "g3", name: "400T" },
];
const getColor = (temp) => {
  if (temp > 500) return "text-danger"; // 🔴 Đỏ (Nguy hiểm)
  if (temp >= 200) return "text-warning"; // 🟡 Vàng (Cảnh báo)
  return "text-success"; // 🟢 Xanh lá (An toàn)
};

const TemperatureCard = ({ tableName }) => {
  const selectedFurnace = furnaces.find(f => f.id === tableName);

  const navigate = useNavigate();
  const latestData = useRealtimeStore((state) => state.latestData[tableName]);
  const sensors = latestData?.sensors || [];
  const { language } = useLanguageStore();
  const calculateAverage = () => {
    if (sensors.length < 8) return "N/A"; // Tránh lỗi nếu dữ liệu không đủ
    const sum = sensors.reduce((acc, curr) => acc + curr, 0);
    return (sum / 8).toFixed(1);
  };

  return (
    <>
      {latestData ? (
        <Card
          className={`h-100 mx-auto shadow position-relative${(sensors[0] === 0 || sensors[1] === 0) ? " card-off" : ""}`}
          style={{
            width: "280px",
            borderColor: "#2B2B40",
            cursor: "pointer",
            transition:
              "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
            backgroundColor: (sensors[0] === 0 || sensors[1] === 0) ? "#343a40" : undefined,
          }}
          onClick={() => navigate(`/analyst/${tableName}`)}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0px 4px 12px rgba(255, 255, 255, 0.5)";
            e.currentTarget.style.transform = "scale(1.02)";
            e.currentTarget.querySelector(".hover-info").style.opacity = 1; // Hiện thông tin khi hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "var(--bs-box-shadow)";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.querySelector(".hover-info").style.opacity = 0; // Ẩn thông tin khi rời chuột
          }}
        >
          <Card.Header
            className="text-center border-secondary py-2 text-white"
            style={{ backgroundColor: "#151515" }}
          >
            {`${locales[language].title} ${selectedFurnace.name.toUpperCase()}`}
          </Card.Header>

          {/* <Card.Body className="py-3 text-center">
            {(sensors[0] === 0 || sensors[1] === 0) ? (
              <div
                className="fw-bold text-warning"
                style={{ fontSize: "48px", margin: "40px 0" }}
              >
                OFF
              </div>
            ) : (
              <>
                <div className="fw-bold text-muted">
                  {locales[language].rexSensor}
                </div>
                <div
                  className={`fw-bold ${getColor(sensors[0])}`}
                  style={{ fontSize: "32px" }}
                >
                  {sensors[0] ?? "N/A"}°C
                </div>

                <div className="fw-bold text-muted mt-2">
                  {locales[language].pidSensor}
                </div>
                <div
                  className={`fw-bold ${getColor(sensors[1])}`}
                  style={{ fontSize: "32px" }}
                >
                  {sensors[1] ?? "N/A"}°C
                </div>

                <div className="fw-bold text-muted mt-2">
                  {locales[language].chinoAvg}
                </div>
                <div
                  className={`fw-bold ${getColor(calculateAverage())}`}
                  style={{ fontSize: "32px" }}
                >
                  {`${calculateAverage()}°C`}
                </div>
              </>
            )}
          </Card.Body> */}
          <Card.Body className="py-3 text-center card-body-fixed">
            {(sensors[0] === 0 || sensors[1] === 0) ? (
              <div
                className="fw-bold text-warning d-flex align-items-center justify-content-center w-100 h-100"
                style={{ fontSize: "48px" }}
              >
                OFF
              </div>
            ) : (
              <>
                <div className="fw-bold text-muted">
                  {locales[language].rexSensor}
                </div>
                <div
                  className={`fw-bold ${getColor(sensors[0])}`}
                  style={{ fontSize: "32px" }}
                >
                  {sensors[0] ?? "N/A"}°C
                </div>

                <div className="fw-bold text-muted mt-2">
                  {locales[language].pidSensor}
                </div>
                <div
                  className={`fw-bold ${getColor(sensors[1])}`}
                  style={{ fontSize: "32px" }}
                >
                  {sensors[1] ?? "N/A"}°C
                </div>

                <div className="fw-bold text-muted mt-2">
                  {locales[language].chinoAvg}
                </div>
                <div
                  className={`fw-bold ${getColor(calculateAverage())}`}
                  style={{ fontSize: "32px" }}
                >
                  {`${calculateAverage()}°C`}
                </div>
              </>
            )}
          </Card.Body>
          <style>
            {`
              .card-body-fixed {
                min-height: 250px;
                height: 250px;
                display: flex;
                flex-direction: column;
                justify-content: center;
              }
              .card-off .card-body-fixed {
                display: flex;
                align-items: center;
                justify-content: center;
              }
            `}
          </style>
          {/* Thông tin hover - Cải thiện giao diện */}
          <div
            className="hover-info position-absolute text-white"
            style={{
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "black", // Tông xám đậm, đồng bộ với giao diện
              color: "#ffffff", // Chữ trắng để dễ đọc
              padding: "6px 10px", // Giảm padding để gọn hơn
              borderRadius: "6px", // Bo góc nhẹ
              fontSize: "14px", // Giảm kích thước chữ
              fontWeight: "normal", // Bỏ bold để nhẹ nhàng hơn
              boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.4)", // Bóng mờ nhẹ
              opacity: 0,
              transition: "opacity 0.3s ease-in-out",
              whiteSpace: "nowrap",
            }}
          >
            {`${locales[language].updated}: ${latestData?.timestamp || "N/A"}`}
          </div>
        </Card>
      ) : (
        <div className="text-center text-muted">
          {locales[language].loading}
        </div>
      )}
    </>
  );
};

export default TemperatureCard;
