import React from "react";
import { Nav, Dropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import useLanguageStore from "../services/languageStore";
import logo from "../assets/KD logo tách nềnn.png";

const Header = () => {
  const { language, setLanguage } = useLanguageStore();

  const languages = {
    en: "English",
    vi: "Tiếng Việt",
    zh: "繁體中文",
  };

  const flagCodes = {
    en: "gb",
    vi: "vn",
    zh: "cn",
  };

  const menuLabels = {
    en: { home: "🏠 Dashboard", analyst: "📜 Analyst" },
    vi: { home: "🏠 Trang chủ", analyst: "📜 Phân tích" },
    zh: { home: "🏠 儀表板", analyst: "📜 分析" },
  };

  return (
    <>
      <div className="sidebar d-flex flex-column bg-dark text-white vh-100 p-3">
        <div className="mb-4 text-center">
          <img
            src={logo}
            alt="Quản Lý Nhiệt Độ"
            height="50"
            className="d-inline-block align-top"
          />
        </div>
        <Nav className="flex-column mb-4">
          <Nav.Link as={NavLink} to="/" className="text-white mb-2" activeClassName="active">
            {menuLabels[language].home}
          </Nav.Link>
          <Nav.Link as={NavLink} to="/analyst" className="text-white mb-2" activeClassName="active">
            {menuLabels[language].analyst}
          </Nav.Link>
          <div className="mt-auto">
            <Dropdown align="end">
              <Dropdown.Toggle className="custom-dropdown-toggle w-100">
                <span
                  className={`flag-icon flag-icon-${flagCodes[language]} me-2`}
                  style={{ verticalAlign: "middle" }}
                ></span>
                {languages[language]}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {Object.entries(languages).map(([key, label]) => (
                  <Dropdown.Item key={key} onClick={() => setLanguage(key)}>
                    <span
                      className={`flag-icon flag-icon-${flagCodes[key]} me-2`}
                      style={{ verticalAlign: "middle" }}
                    ></span>
                    {label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Nav>
        <div className="sidebar-credit text-center">
          © 2025 by
          <a
            href="https://github.com/DaTT2001"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#adb5bd", textDecoration: "underline", marginLeft: 4, display: "inline-flex", alignItems: "center" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              fill="#adb5bd"
              viewBox="0 0 24 24"
              style={{ marginRight: 4, verticalAlign: "middle" }}
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.415-4.042-1.415-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
            DaTT2001
          </a>
        </div>
      </div>
      <style>
        {`
          .sidebar {
            width: 220px;
            min-width: 180px;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1040;
            height: 100vh;
            box-shadow: 2px 0 8px rgba(0,0,0,0.08);
            display: flex;
            flex-direction: column;
          }
                  .sidebar-credit {
          margin-top: auto;
          font-size: 0.95rem;
          color: #adb5bd;
          padding-bottom: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 4px;
        }
          .sidebar .nav-link {
            color: #fff !important;
            font-size: 1.1rem;
            border-radius: 4px;
          }
          .sidebar .nav-link.active, .sidebar .nav-link:focus, .sidebar .nav-link:hover {
            background: #495057 !important;
            color: #fff !important;
          }
          .custom-dropdown-toggle {
            border: none !important;
            background-color: #343a40 !important;
            color: #fff !important;
            padding: 0.5rem 1rem;
            display: flex;
            align-items: center;
            font-size: 1rem;
          }
          .custom-dropdown-toggle::after {
            border-top-color: #6c757d !important;
          }
        `}
      </style>
    </>
  );
};

export default Header;