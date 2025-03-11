import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useTable } from "./TableContext";

const TemperatureContext = createContext();

export function TemperatureProvider({ children }) {
  const { selectedTable } = useTable();
  const [latestTemperature, setLatestTemperature] = useState({});
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    async function fetchLatestTemperature() {
      let { data, error } = await supabase
        .from(selectedTable)
        .select("timestamp, sensor1_temperature, sensor2_temperature, sensor3_temperature, sensor4_temperature, sensor5_temperature, sensor6_temperature")
        .order("timestamp", { ascending: false })
        .limit(1);
        console.log("Dữ liệu nhận từ Supabase:", data); // 👀 Debug API trả về
      if (error) {
        console.error("Lỗi khi lấy nhiệt độ mới nhất:", error.message);
      } else if (data.length > 0) {
        setLatestTemperature(data[0]);
        const time = new Date(data[0].timestamp).toLocaleString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        setFormattedTime(time);
      }
    }
    fetchLatestTemperature();
    const interval = setInterval(fetchLatestTemperature, 5000);
    return () => clearInterval(interval);
    
    
  }, [selectedTable]);
  return (
    <TemperatureContext.Provider value={{ latestTemperature, formattedTime }}>
      {children}
    </TemperatureContext.Provider>
  );
}

// Hook dùng để gọi context
export function useTemperature() {
  return useContext(TemperatureContext);
}