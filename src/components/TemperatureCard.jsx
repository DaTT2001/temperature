import React from "react";
import { Card } from "react-bootstrap";
import { useRealtimeStore } from "../services/realtimeStore";

const getColor = (temp) => {
  if (temp > 500) return "text-danger"; // 🔴 Đỏ (Nguy hiểm)
  if (temp >= 200) return "text-warning"; // 🟡 Vàng (Cảnh báo)
  return "text-success"; // 🟢 Xanh lá (An toàn)
};

const TemperatureCard = ({ tableName }) => {
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
          className="h-100 mx-auto shadow"
          style={{ width: "280px", borderColor: "#2B2B40" }}
        >
          <Card.Header
            className="text-center border-secondary py-2 text-white"
            style={{ backgroundColor: "#151515" }}
          >
            {`NHIỆT ĐỘ LÒ ${tableName.toUpperCase()}`}
          </Card.Header>

          <Card.Body className="py-3 text-center">
            <div className="fw-bold text-muted">Bộ điều khiển</div>
            <div
              className={`fw-bold ${getColor(sensors[0])}`}
              style={{ fontSize: "32px" }}
            >
              {sensors[0] ?? "N/A"}°C
            </div>

            <div className="fw-bold text-muted mt-2">Bộ đo</div>
            <div
              className={`fw-bold ${getColor(sensors[1])}`}
              style={{ fontSize: "32px" }}
            >
              {sensors[1] ?? "N/A"}°C
            </div>

            <div className="fw-bold text-muted mt-2">Chino TB</div>
            <div
              className={`fw-bold ${getColor(calculateAverage())}`}
              style={{ fontSize: "32px" }}
            >
              {calculateAverage()}°C
            </div>
          </Card.Body>

          <Card.Footer
            className="text-center border-secondary py-1 text-white"
            style={{ backgroundColor: "#151515" }}
          >
            <small className="text-white">
              Updated: {latestData.timestamp || "N/A"}
            </small>
          </Card.Footer>
        </Card>
      ) : (
        <div className="text-center text-muted">Đang chờ dữ liệu...</div>
      )}
    </>
  );
};

export default TemperatureCard;
