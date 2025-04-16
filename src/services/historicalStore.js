import { create } from "zustand";
import { formatTemperatureData, API_BASE_URL } from "./api";
import { useRealtimeStore } from "./realtimeStore"; // Thêm import này

export const useHistoricalStore = create((set, get) => ({
  dailyData: {
    t4: [],
    t5: [],
    g1: [],
    g2: [],
    g3: [],
  },
  selectedDate: new Date(),
  isLiveMode: true,

  setLiveMode: (mode) => {
    set({ isLiveMode: mode });
    
    if (mode) {
      // Live mode: set ngày hiện tại và bật polling
      const today = new Date();
      set({ selectedDate: today });
      get().fetchLiveData();
      // Bật polling ở realtimeStore
      useRealtimeStore.getState().startPolling();
    } else {
      // History mode: dừng polling
      useRealtimeStore.getState().stopPolling();
    }
  },

  fetchHistoricalData: async (date) => {
    if (get().isLiveMode) {
      console.warn('❌ Không thể fetch dữ liệu lịch sử trong Live mode');
      return;
    }

    try {
      set({ selectedDate: date });
      const tables = ["t4", "t5", "g1", "g2", "g3"];
      
      // Dừng polling khi fetch dữ liệu lịch sử
      useRealtimeStore.getState().stopPolling();
      
      for (const table of tables) {
        const formattedDate = date.toISOString().split('T')[0];
        const response = await fetch(
          `${API_BASE_URL}/${table}?date=${formattedDate}`
        );

        if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);

        const result = await response.json();
        if (result.data.length > 0) {
          set((state) => ({
            dailyData: {
              ...state.dailyData,
              [table]: result.data.map(record => formatTemperatureData(record)),
            },
          }));
        }
      }
    } catch (error) {
      console.error('❌ Lỗi khi fetch dữ liệu lịch sử:', error);
    }
  },

  fetchLiveData: async () => {
    if (!get().isLiveMode) return;

    const tables = ["t4", "t5", "g1", "g2", "g3"];
    const today = new Date();
    set({ selectedDate: today });

    try {
      for (const table of tables) {
        const formattedDate = today.toISOString().split('T')[0];
        const response = await fetch(
          `${API_BASE_URL}/${table}?date=${formattedDate}`
        );

        if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);

        const result = await response.json();
        if (result.data.length > 0) {
          set((state) => ({
            dailyData: {
              ...state.dailyData,
              [table]: result.data.map(record => formatTemperatureData(record)),
            },
          }));
        }
      }
    } catch (error) {
      console.error('❌ Lỗi khi fetch dữ liệu realtime:', error);
    }
  },
}));