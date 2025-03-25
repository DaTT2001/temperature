import { create } from "zustand";
import { supabase } from "./supabase";

const formatTemperatureData = (record) => {
  try {
    return {
      timestamp: new Date(record.timestamp).toLocaleString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }),
      sensors: [
        record.sensor1_temperature,
        record.sensor2_temperature,
        record.sensor3_temperature,
        record.sensor4_temperature,
        record.sensor5_temperature,
        record.sensor6_temperature,
        record.sensor7_temperature,
        record.sensor8_temperature,
      ],
    };
  } catch (error) {
    console.error("Lỗi khi định dạng dữ liệu nhiệt độ:", error);
    return null; // Trả về null để tránh lỗi khi hiển thị
  }
};

export const useRealtimeStore = create((set) => ({
  latestData: {
    t4: null,
    t5: null,
    g1: null,
    g2: null,
    g3: null,
  },

  subscribeToRealtime: () => {
    const tables = ["t4", "t5", "g1", "g2", "g3"];

    // Lấy dữ liệu mới nhất khi khởi động
    tables.forEach(async (tableName) => {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select("*")
          .order("timestamp", { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;

        if (data) {
          const formattedData = formatTemperatureData(data);
          if (formattedData) {
            set((state) => ({
              latestData: {
                ...state.latestData,
                [tableName]: formattedData,
              },
            }));
          }
        }
      } catch (error) {
        console.error(`Lỗi khi lấy dữ liệu từ bảng ${tableName}:`, error);
      }
    });

    // Subscribe realtime
    const subscriptions = tables.map((tableName) => {
      try {
        return supabase
          .channel(`realtime-${tableName}`)
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: tableName },
            (payload) => {
              try {
                if (payload.new) {
                  const formattedData = formatTemperatureData(payload.new);
                  if (formattedData) {
                    set((state) => ({
                      latestData: {
                        ...state.latestData,
                        [tableName]: formattedData,
                      },
                    }));
                  }
                }
              } catch (error) {
                console.error(
                  `Lỗi khi xử lý dữ liệu realtime từ ${tableName}:`,
                  error
                );
              }
            }
          )
          .subscribe();
      } catch (error) {
        console.error(`Lỗi khi đăng ký realtime cho bảng ${tableName}:`, error);
        return null; // Trả về null để tránh crash
      }
    });

    return () =>
      subscriptions.forEach((sub) => {
        if (sub) sub.unsubscribe();
      });
  },
}));
