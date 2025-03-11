import './App.css';
import TemperatureData from './TemperatureData';
import { FaMoon, FaSun } from "react-icons/fa";
import Scrollbar from 'react-scrollbars-custom';
import { TableProvider } from './context/TableContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TemperatureProvider } from './context/TemperatureContext';

function AppContent() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <TableProvider>
      <TemperatureProvider>
        <Scrollbar style={{ width: '100vw', height: '100vh' }}>
          <div className={darkMode ? "bg-dark text-white min-vh-100" : "bg-light text-dark min-vh-100"} style={{ minHeight: "100vh" }}>
            <div className="container py-3">
              <TemperatureData darkMode={darkMode} />
            </div>

            {/* 🌙☀️ Nút chuyển đổi Theme cố định */}
            <button
              className={`theme-toggle-btn ${darkMode ? "" : "light"}`}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? <FaSun size={24} className="text-warning" /> : <FaMoon size={24} className="text-info" />}
            </button>
          </div>
        </Scrollbar>
      </TemperatureProvider>
    </TableProvider>
  );
}

function App() {
  return (
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
  );
}

export default App;
