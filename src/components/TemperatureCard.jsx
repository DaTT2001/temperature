import React from "react";
import { Button, Card } from "react-bootstrap";
import { useRealtimeStore } from "../services/realtimeStore";
import { useNavigate } from "react-router-dom";

const getColor = (temp) => {
  if (temp > 500) return "text-danger"; // 🔴 Đỏ (Nguy hiểm)
  if (temp >= 200) return "text-warning"; // 🟡 Vàng (Cảnh báo)
  return "text-success"; // 🟢 Xanh lá (An toàn)
};

const TemperatureCard = ({ tableName }) => {
  const navigate = useNavigate();
  const latestData = useRealtimeStore((state) => state.latestData[tableName]);
  const sensors = latestData?.sensors || [];

  const calculateAverage = () => {
    if (sensors.length < 8) return "N/A"; // Tránh lỗi nếu dữ liệu không đủ
    const sum = sensors.slice(2, 8).reduce((acc, curr) => acc + curr, 0);
    return (sum / 6).toFixed(1);
  };

  return (
    <>
      {latestData ? (
        <Card
          className="h-100 mx-auto shadow position-relative"
          style={{
            width: "280px",
            borderColor: "#2B2B40",
            cursor: "pointer",
            transition:
              "transform 0.15s ease-in-out, box-shadow 0.15s ease-in-out",
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
            {`TEMPERATURE ${tableName.toUpperCase()}`}
          </Card.Header>

          <Card.Body className="py-3 text-center">
            <div className="fw-bold text-muted">PID Controller</div>
            <div
              className={`fw-bold ${getColor(sensors[0])}`}
              style={{ fontSize: "32px" }}
            >
              {sensors[0] ?? "N/A"}°C
            </div>

            <div className="fw-bold text-muted mt-2">REX Sensor</div>
            <div
              className={`fw-bold ${getColor(sensors[1])}`}
              style={{ fontSize: "32px" }}
            >
              {sensors[1] ?? "N/A"}°C
            </div>

            <div className="fw-bold text-muted mt-2">Chino AVG</div>
            <div
              className={`fw-bold ${getColor(calculateAverage())}`}
              style={{ fontSize: "32px" }}
            >
              {calculateAverage()}°C
            </div>
          </Card.Body>
          {/* Thông tin hover - Cải thiện giao diện */}
          <div
            className="hover-info position-absolute text-white"
            style={{
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "rgba(255, 193, 7, 0.9)", // Màu vàng nổi bật
              color: "black", // Chữ đen dễ đọc
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "16px", // Tăng kích thước chữ
              fontWeight: "bold",
              boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.3)", // Đổ bóng cho nổi bật
              opacity: 0,
              transition: "opacity 0.3s ease-in-out",
              whiteSpace: "nowrap", // Tránh bị xuống dòng
            }}
          >
            {`Updated: ${latestData?.timestamp || "N/A"}`}
          </div>
          {/* <Card.Footer
            className="text-center border-secondary py-1 text-white"
            style={{ backgroundColor: "#151515" }}
          >
            <small className="text-white">
              Updated: {latestData.timestamp || "N/A"}
            </small>
          </Card.Footer> */}
        </Card>
      ) : (
        <div className="text-center text-muted">Đang chờ dữ liệu...</div>
      )}
    </>
  );
};

export default TemperatureCard;
