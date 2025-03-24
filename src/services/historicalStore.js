import { create } from "zustand";
import { supabase, formatTemperatureData } from "./supabase";

export const useHistoricalStore = create((set, get) => ({
    dailyData: {
        t4: [],
        t5: [],
        g1: [],
        g2: [],
        g3: []
    },
    selectedDate: new Date(),

    setSelectedDate: (date) => {
        try {
            if (!date || isNaN(new Date(date))) {
                console.error("Lỗi: Ngày không hợp lệ:", date);
                return;
            }

            set({
                selectedDate: date,
                dailyData: {
                    t4: [],
                    t5: [],
                    g1: [],
                    g2: [],
                    g3: []
                }
            });

            const tables = ['t4', 't5', 'g1', 'g2', 'g3'];
            tables.forEach(table => useHistoricalStore.getState().fetchDailyData(table, date));

            // Nếu là hôm nay thì subscribe realtime
            const isToday = new Date(date).toDateString() === new Date().toDateString();
            if (isToday) {
                get().subscribeToTodayChanges();
            }
        } catch (error) {
            console.error("Lỗi khi đặt ngày được chọn:", error);
        }
    },

    subscribeToTodayChanges: () => {
        try {
            const tables = ['t4', 't5', 'g1', 'g2', 'g3'];

            // Subscribe to changes
            const subscriptions = tables.map(tableName =>
                supabase
                    .channel(`historical-${tableName}`)
                    .on(
                        'postgres_changes',
                        { event: 'INSERT', schema: 'public', table: tableName },
                        payload => {
                            try {
                                if (payload.new) {
                                    const selectedDate = get().selectedDate;
                                    const newRecordDate = new Date(payload.new.timestamp);

                                    // Chỉ cập nhật nếu dữ liệu mới thuộc về ngày hôm nay
                                    if (selectedDate.toDateString() === newRecordDate.toDateString()) {
                                        set(state => ({
                                            dailyData: {
                                                ...state.dailyData,
                                                [tableName]: [
                                                    ...state.dailyData[tableName],
                                                    formatTemperatureData(payload.new)
                                                ]
                                            }
                                        }));
                                    }
                                }
                            } catch (error) {
                                console.error(`Lỗi khi xử lý dữ liệu realtime từ ${tableName}:`, error);
                            }
                        }
                    )
                    .subscribe()
            );

            return () => subscriptions.forEach(sub => {
                if (sub) sub.unsubscribe();
            });
        } catch (error) {
            console.error("Lỗi khi đăng ký realtime:", error);
        }
    },

    fetchDailyData: async (tableName, date) => {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);

            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            let allData = [];
            let page = 0;
            const pageSize = 1000;

            while (true) {
                const { data, error } = await supabase
                    .from(tableName)
                    .select("*")
                    .gte('timestamp', startOfDay.toISOString())
                    .lte('timestamp', endOfDay.toISOString())
                    .order("timestamp", { ascending: true })
                    .range(page * pageSize, (page + 1) * pageSize - 1);

                if (error) {
                    console.error(`Lỗi khi lấy dữ liệu từ bảng ${tableName}:`, error);
                    break;
                }

                if (!data || data.length === 0) break;

                allData = [...allData, ...data];
                if (data.length < pageSize) break;
                page++;
            }

            if (allData.length > 0) {
                set(state => ({
                    dailyData: {
                        ...state.dailyData,
                        [tableName]: allData.map(record => formatTemperatureData(record))
                    }
                }));
            }
        } catch (error) {
            console.error(`Lỗi khi fetch dữ liệu lịch sử từ ${tableName}:`, error);
        }
    },
    startDayChangeCheck: () => {
        // Check mỗi phút
        const interval = setInterval(() => {
            const currentDate = new Date();
            const selectedDate = get().selectedDate;

            // Nếu đang xem today và đã sang ngày mới
            if (
                selectedDate.toDateString() === new Date(Date.now() - 86400000).toDateString() && 
                currentDate.getHours() === 0 && 
                currentDate.getMinutes() === 0
            ) {
                console.log("Đã sang ngày mới, tự động cập nhật date...");
                get().setSelectedDate(new Date());
            }
        }, 60000); // Check mỗi phút

        return () => clearInterval(interval);
    }
}));