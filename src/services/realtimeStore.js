import { create } from "zustand";
import { formatTemperatureData, API_BASE_URL } from "./api";

const POLLING_INTERVAL = 10000;

export const useRealtimeStore = create((set, get) => ({
  latestData: {
    t4: null,
    t5: null,
    g1: null,
    g2: null,
    g3: null,
  },
  isPolling: false,
  activeIntervals: [],

  startPolling: () => {
    console.log('🔄 Kiểm tra trạng thái polling...');
    
    // Nếu đang polling thì không tạo thêm interval mới
    if (get().isPolling) {
      console.log('⚠️ Polling đã đang chạy');
      return get().stopPolling;
    }

    console.log('✅ Bắt đầu polling mới');
    const tables = ["t4", "t5", "g1", "g2", "g3"];
    const intervals = [];

    const fetchLatestData = async (table) => {
      try {
        // const today = new Date().toISOString().split('T')[0];
        // console.log(`📡 Fetch dữ liệu ${table} cho ngày ${today}`);

        // const response = await fetch(
        //   `${API_BASE_URL}/${table}?date=${today}`
        // );        
        const response = await fetch(`${API_BASE_URL}/${table}/latest`);
        if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
        const { data: latestRecord } = await response.json();

        // const result = await response.json();
        
        // if (result.data && result.data.length > 0) {
        //   const latestRecord = result.data[result.data.length - 1];
        //   const formattedData = formatTemperatureData(latestRecord);
          
        //   set((state) => {
        //     if (JSON.stringify(state.latestData[table]) !== JSON.stringify(formattedData)) {
        //       console.log(`✨ Cập nhật dữ liệu mới cho ${table}`);
        //       return {
        //         latestData: {
        //           ...state.latestData,
        //           [table]: formattedData,
        //         },
        //       };
        //     }
        //     return state;
        //   });
        // }
        if (latestRecord) {
          const formattedData = formatTemperatureData(latestRecord);
          
          set((state) => {
            // Chỉ cập nhật nếu dữ liệu mới khác dữ liệu cũ
            if (JSON.stringify(state.latestData[table]) !== JSON.stringify(formattedData)) {
              console.log(`✨ Cập nhật dữ liệu mới cho ${table}`);
              return {
                latestData: {
                  ...state.latestData,
                  [table]: formattedData,
                },
              };
            }
            return state;
          });
        }
      } catch (error) {
        console.error(`❌ Lỗi khi lấy dữ liệu ${table}:`, error.message);
      }
    };

    // Fetch lần đầu
    tables.forEach(table => fetchLatestData(table));

    // Set up polling
    tables.forEach(table => {
      const interval = setInterval(() => fetchLatestData(table), POLLING_INTERVAL);
      intervals.push(interval);
    });

    set({ 
      isPolling: true,
      activeIntervals: intervals 
    });

    // Return cleanup function
    return () => {
      console.log('🛑 Cleanup polling...');
      intervals.forEach(interval => clearInterval(interval));
      set({ 
        isPolling: false,
        activeIntervals: [] 
      });
    };
  },

  stopPolling: () => {
    const state = get();
    console.log('🛑 Dừng polling...', state.activeIntervals.length);
    
    state.activeIntervals.forEach(interval => {
      clearInterval(interval);
    });
    
    set({ 
      isPolling: false,
      activeIntervals: [] 
    });
  },
}));