import { Card } from "react-bootstrap";
import { useTemperature } from "../src/context/TemperatureContext";
import { useTheme } from "../src/context/ThemeContext";

function RealTimeTemperature() {
  const { latestTemperature, formattedTime } = useTemperature();
  const { darkMode } = useTheme();

  return (
    <Card style={darkMode ? styles.darkMode.card : styles.lightMode.card}>
      <Card.Body>
        <div style={styles.header}>
          <h5>🔥 Temperature</h5>
          <span style={darkMode ? styles.darkMode.clock : styles.lightMode.clock}>
            Last update: {formattedTime || "Đang cập nhật..."}
          </span>
        </div>

        <div style={{ ...styles.sensorGrid, gridTemplateColumns: "repeat(3, 1fr)" }}>
          {["sensor1", "sensor2", "sensor3", "sensor4", "sensor5", "sensor6"].map((sensor, index) => (
            <div key={index} style={darkMode ? styles.darkMode.sensorBox : styles.lightMode.sensorBox}>
              <span style={darkMode ? styles.darkMode.sensorName : styles.lightMode.sensorName}>
                {sensor.toUpperCase()}
              </span>
              <span style={darkMode ? styles.darkMode.sensorValue : styles.lightMode.sensorValue}>
                {latestTemperature[`${sensor}_temperature`] !== undefined
                  ? `${latestTemperature[`${sensor}_temperature`].toFixed(1)}°C`
                  : "N/A"}
              </span>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}

// 🎨 CSS in JS
const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "10px",
    borderBottom: "2px solid rgba(255, 255, 255, 0.2)",
  },
  sensorGrid: {
    display: "grid",
    gap: "12px",
    marginTop: "15px",
  },

  // 🌙 DARK MODE STYLES
  darkMode: {
    card: {
      background: "linear-gradient(135deg, #282c34, #3a3f47)",
      color: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      padding: "15px",
      textAlign: "center",
    },
    clock: {
      fontSize: "16px",
      fontWeight: "bold",
      background: "#111",
      padding: "6px 14px",
      borderRadius: "8px",
      fontFamily: "'Courier New', monospace",
      color: "#32cd32",
      boxShadow: "0 0 8px #32cd32",
    //   display: window.innerWidth < 576 ? "none" : "inline-block",
    },
    sensorBox: {
      background: "rgba(255, 255, 255, 0.1)",
      padding: "12px",
      borderRadius: "8px",
      textAlign: "center",
      boxShadow: "0 2px 5px rgba(255, 255, 255, 0.2)",
    },
    sensorName: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#ddd",
    },
    sensorValue: {
      fontSize: "20px",
      fontWeight: "bold",
      marginTop: "5px",
      display: "block",
      color: "#ffeb3b",
      textShadow: "0 0 8px #ffeb3b",
    },
  },

  // ☀️ LIGHT MODE STYLES
  lightMode: {
    card: {
      background: "#ffffff",
      color: "#333",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      padding: "15px",
      textAlign: "center",
    },
    clock: {
      fontSize: "16px",
      fontWeight: "bold",
      background: "#f0f0f0",
      padding: "6px 14px",
      borderRadius: "8px",
      fontFamily: "'Courier New', monospace",
      color: "#333",
      display: window.innerWidth < 576 ? "none" : "inline-block",
    },
    sensorBox: {
      background: "#f9f9f9",
      padding: "12px",
      borderRadius: "8px",
      textAlign: "center",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
    },
    sensorName: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#444",
    },
    sensorValue: {
      fontSize: "20px",
      fontWeight: "bold",
      marginTop: "5px",
      display: "block",
      color: "#d9534f",
      textShadow: "0 0 4px #d9534f",
    },
  },
};

export default RealTimeTemperature;
