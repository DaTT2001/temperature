import { createContext, useContext, useState, useEffect } from "react";

// Tạo Context
const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Lưu trạng thái dark mode vào localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem("darkMode")) || true;
  });

  // Cập nhật localStorage mỗi khi darkMode thay đổi
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook để sử dụng ThemeContext
export function useTheme() {
  return useContext(ThemeContext);
}
