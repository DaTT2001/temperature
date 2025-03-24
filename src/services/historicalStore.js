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
        set({ selectedDate: date,
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
        // Nếu là today thì subscribe realtime
        const isToday = new Date(date).toDateString() === new Date().toDateString();
        if (isToday) {
            get().subscribeToTodayChanges();
        }
    },
    subscribeToTodayChanges: () => {
        const tables = ['t4', 't5', 'g1', 'g2', 'g3'];
        
        // Subscribe to changes
        const subscriptions = tables.map(tableName => 
            supabase
                .channel(`historical-${tableName}`)
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: tableName },
                    payload => {
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
                    }
                )
                .subscribe()
        );

        return () => subscriptions.forEach(sub => sub.unsubscribe());
    },
    fetchDailyData: async (tableName, date) => {
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

            if (error || !data || data.length === 0) break;

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
    }
}));