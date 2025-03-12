import { createContext, useContext, useState, useEffect } from "react";

const TableContext = createContext();

export function TableProvider({ children }) {
  // Quản lý bảng được chọn
  const [selectedTable, setSelectedTable] = useState(() => {
    return localStorage.getItem("selectedTable") || "t1";
  });

  // Quản lý khoảng thời gian được chọn
  const [timeRange, setTimeRange] = useState(() => {
    try {
      const savedRange = localStorage.getItem("timeRange");
      return savedRange ? JSON.parse(savedRange) : { startTime: "", endTime: "" };
    } catch (error) {
      console.error("Lỗi khi đọc timeRange từ localStorage:", error);
      return { startTime: "", endTime: "" };
    }
  });

  // Cập nhật localStorage khi selectedTable thay đổi
  useEffect(() => {
    localStorage.setItem("selectedTable", selectedTable);
  }, [selectedTable]);

  // Cập nhật localStorage khi timeRange thay đổi
  useEffect(() => {
    try {
      localStorage.setItem("timeRange", JSON.stringify(timeRange));
    } catch (error) {
      console.error("Lỗi khi lưu timeRange vào localStorage:", error);
    }
  }, [timeRange]);

  return (
    <TableContext.Provider value={{ selectedTable, setSelectedTable, timeRange, setTimeRange }}>
      {children}
    </TableContext.Provider>
  );
}

// Custom hook để sử dụng context dễ dàng
export function useTable() {
  return useContext(TableContext);
}