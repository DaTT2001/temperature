import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analyst from "./pages/Analyst";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import { useRealtimeStore } from "./services/realtimeStore";
import { useHistoricalStore } from "./services/historicalStore";
import Footer from "./components/Footer";

function App() {
  const setLiveMode = useHistoricalStore((state) => state.setLiveMode);
  const fetchLiveData = useHistoricalStore((state) => state.fetchLiveData);

  useEffect(() => {
    console.log('🚀 Khởi tạo ứng dụng...');
    
    // Chỉ cần bật Live Mode, polling sẽ được quản lý bởi historicalStore
    setLiveMode(true);
    fetchLiveData();

    // Cleanup khi component unmount
    return () => {
      console.log('🛑 Dọn dẹp ứng dụng...');
      setLiveMode(false); // Sẽ tự động dừng polling
    };
  }, [setLiveMode, fetchLiveData]);
  
  return (
    <BrowserRouter>
      <div className="min-vh-100">
        <Header />
        <br />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyst" element={<Analyst />} />
          <Route path="/analyst/:id" element={<Analyst />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;