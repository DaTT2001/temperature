import React from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import useLanguageStore from "../services/languageStore"; // Import store zustand
import logo from "../assets/KD logo tách nềnn.png";

const Header = () => {
  const { language, setLanguage } = useLanguageStore();

  // Danh sách ngôn ngữ
  const languages = {
    en: "English",
    vi: "Tiếng Việt",
    zh: "繁體中文",
  };

  const flagCodes = {
    en: "gb", // Cờ Anh
    vi: "vn", // Cờ Việt Nam
    zh: "cn", // Cờ Đài Loan
  };
  // Danh sách menu theo ngôn ngữ
  const menuLabels = {
    en: { home: "🏠 Dashboard", analyst: "📜 Analyst" },
    vi: { home: "🏠 Trang chủ", analyst: "📜 Phân tích" },
    zh: { home: "🏠 儀表板", analyst: "📜 分析" },
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            <img
              src={logo}
              alt="Quản Lý Nhiệt Độ"
              height="40"
              className="d-inline-block align-top"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/">
                {menuLabels[language].home}
              </Nav.Link>
              <Nav.Link as={NavLink} to="/analyst">
                {menuLabels[language].analyst}
              </Nav.Link>
              {/* Dropdown chọn ngôn ngữ */}
              <Dropdown align="end">
                <Dropdown.Toggle className="custom-dropdown-toggle">
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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <style>
        {`
          .custom-dropdown-toggle {
            border: none !important; /* Bỏ viền */
            background-color: transparent !important; /* Bỏ nền */
            color: #fff !important; /* Màu chữ giống các tab khác */
            padding: 0.5rem 1rem; /* Căn chỉnh padding */
            display: flex;
            align-items: center;
            font-size: 1rem; /* Căn chỉnh font */
          }
          .custom-dropdown-toggle:hover {
            
          }
          .custom-dropdown-toggle::after {
            border-top-color: #6c757d !important; /* Màu mũi tên dropdown */
          }
        `}
      </style>
    </>
  );
};

export default Header;
