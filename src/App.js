import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Analyst from "./pages/Analyst";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header";
import { useHistoricalStore } from "./services/historicalStore";

function App() {
  const setLiveMode = useHistoricalStore((state) => state.setLiveMode);
  const fetchLiveData = useHistoricalStore((state) => state.fetchLiveData);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    console.log('🚀 Khởi tạo ứng dụng...');
    
    // Chỉ cần bật Live Mode, polling sẽ được quản lý bởi historicalStore
    setLiveMode(true);
    fetchLiveData();

    // Cleanup khi component unmount
    return () => {
      // console.log('🛑 Dọn dẹp ứng dụng...');
      setLiveMode(false); // Sẽ tự động dừng polling
    };
  }, [setLiveMode, fetchLiveData]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      // console.log(now.getHours(), now.getMinutes());
      
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        // console.log("🕛 Đã đến 0h đêm, reload trang...");
        window.location.reload();
      }
    }, 60 * 1000); // Mỗi 1 phút

    return () => clearInterval(intervalId);
  }, []);
  
  return (
    <BrowserRouter>
      <div className="min-vh-100">
      <button
          className="sidebar-toggle-btn d-md-none"
          onClick={() => setSidebarOpen(true)}
          style={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 2001,
            background: "#343a40",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 12px",
            fontSize: 22,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          ☰
        </button>
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
        <br />
        <div className="main-content" style={{ marginLeft: 220, padding: "24px 12px 0 12px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/analyst" element={<Analyst />} />
          <Route path="/analyst/:id" element={<Analyst />} />
        </Routes>
        </div>
        {/* <Footer /> */}
        <style>
          {`
            @media (max-width: 896px) {
              .main-content {
                margin-left: 0 !important;
              }
            }
          `}
        </style>
      </div>
    </BrowserRouter>
  );
}

export default App;