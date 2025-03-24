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

  const calculateAverage = (sensors) => {
    if (!sensors) return 0;
    const sum = sensors.slice(2, 8).reduce((acc, curr) => acc + curr, 0);
    return (sum / 6).toFixed(1);
  };

  return (
    <>
      {latestData && (
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
              className={`fw-bold ${getColor(latestData?.sensors[0])}`}
              style={{ fontSize: "32px" }}
            >
              {latestData?.sensors[0]}°C
            </div>
            <div className="fw-bold text-muted mt-2">Bộ đo</div>
            <div
              className={`fw-bold ${getColor(latestData?.sensors[1])}`}
              style={{ fontSize: "32px" }}
            >
              {latestData?.sensors[1]}°C
            </div>

            <div className="fw-bold text-muted mt-2">Chino TB</div>
            <div
              className={`fw-bold ${getColor(
                calculateAverage(latestData?.sensors)
              )}`}
              style={{ fontSize: "32px" }}
            >
              {latestData?.sensors[2]}°C
            </div>
          </Card.Body>

          <Card.Footer
            className="text-center border-secondary py-1 text-white"
            style={{ backgroundColor: "#151515" }}
          >
            <small className="text-white">
              Updated: {latestData?.timestamp}
            </small>
          </Card.Footer>
        </Card>
      )}
    </>
  );
};

export default TemperatureCard;
