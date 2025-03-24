import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analyst from "./pages/Analyst";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from "./components/Header";
import { useRealtimeStore } from "./services/realtimeStore";
import { useHistoricalStore } from "./services/historicalStore";
import Footer from "./components/Footer";

function App() {
    const subscribeToRealtime = useRealtimeStore(state => state.subscribeToRealtime);
    const setSelectedDate = useHistoricalStore(state => state.setSelectedDate);
    const startDayChangeCheck = useHistoricalStore(state => state.startDayChangeCheck);
    
    useEffect(() => {
        let unsubscribe;
        try {
            // Subscribe to realtime data
            unsubscribe = subscribeToRealtime();

            // Fetch today's historical data
            setSelectedDate(new Date());
        } catch (error) {
            console.error("Lỗi trong useEffect của App:", error);
        }

        // Cleanup subscription on unmount
        return () => {
            if (typeof unsubscribe === "function") {
                unsubscribe();
            }
        };
    }, [subscribeToRealtime, setSelectedDate]);

    useEffect(() => {
        const unsubscribeRealtime = subscribeToRealtime();
        setSelectedDate(new Date());
        
        // Start checking for day change
        const stopDayChangeCheck = startDayChangeCheck();

        return () => {
            unsubscribeRealtime();
            stopDayChangeCheck();
        };
    }, []);

    return (
        <BrowserRouter>
            <div className="min-vh-100">
                <Header />
                <br />
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/analyst" element={<Analyst />} />
                </Routes>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
