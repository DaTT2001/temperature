import { createContext, useContext, useState, useEffect } from "react";

const TableContext = createContext();

export function TableProvider({ children }) {
  // Khởi tạo từ localStorage hoặc mặc định là "t1"
  const [selectedTable, setSelectedTable] = useState(() => {
    return localStorage.getItem("selectedTable") || "t1";
  });


  // Cập nhật localStorage khi selectedTable thay đổi
  useEffect(() => {
    localStorage.setItem("selectedTable", selectedTable);
  }, [selectedTable]);

  return (
    <TableContext.Provider value={{ selectedTable, setSelectedTable}}>
      {children}
    </TableContext.Provider>
  );
}

// Custom hook để dễ sử dụng Context
export function useTable() {
  return useContext(TableContext);
}
