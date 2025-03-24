import { create } from "zustand";
import { supabase } from "./supabase";

const formatTemperatureData = (record) => ({
    timestamp: new Date(record.timestamp).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }),
    sensors: [
        record.sensor1_temperature,
        record.sensor2_temperature,
        record.sensor3_temperature,
        record.sensor4_temperature,
        record.sensor5_temperature,
        record.sensor6_temperature,
        record.sensor7_temperature,
        record.sensor8_temperature
    ]
});

export const useRealtimeStore = create((set) => ({
    latestData: {
        t4: null,
        t5: null,
        g1: null,
        g2: null,
        g3: null
    },

    subscribeToRealtime: () => {
        const tables = ['t4', 't5', 'g1', 'g2', 'g3'];

        // Lấy dữ liệu mới nhất khi khởi động
        tables.forEach(async (tableName) => {
            const { data } = await supabase
                .from(tableName)
                .select("*")
                .order('timestamp', { ascending: false })
                .limit(1)
                .single();

            if (data) {
                set(state => ({
                    latestData: {
                        ...state.latestData,
                        [tableName]: formatTemperatureData(data)
                    }
                }));
            }
        });

        // Subscribe realtime
        const subscriptions = tables.map(tableName => 
            supabase
                .channel(`realtime-${tableName}`)
                .on(
                    'postgres_changes',
                    { event: 'INSERT', schema: 'public', table: tableName },
                    payload => {
                        if (payload.new) {
                            set(state => ({
                                latestData: {
                                    ...state.latestData,
                                    [tableName]: formatTemperatureData(payload.new)
                                }
                            }));
                        }
                    }
                )
                .subscribe()
        );

        return () => subscriptions.forEach(sub => sub.unsubscribe());
    }
}));