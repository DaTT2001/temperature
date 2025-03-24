import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
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

    useEffect(() => {
        // Subscribe to realtime data
        const unsubscribe = subscribeToRealtime();
        
        // Fetch today's historical data
        setSelectedDate(new Date());

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, [subscribeToRealtime, setSelectedDate]);

    return (
        <BrowserRouter>
            <div className="min-vh-100">
                <Header/>
                <br/>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/analyst" element={<Analyst />} />
                </Routes>
                <Footer/>
            </div>
        </BrowserRouter>
    );
}

export default App;