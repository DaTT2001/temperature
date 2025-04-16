import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons
import styles from "./Footer.module.css";
import useLanguageStore from "../services/languageStore"; // Import Zustand store

const locales = {
  vi: {
    warehouseManagement:
      "Quản lý, phân tích nhiệt độ lò gia nhiệt và máy xử lý nhiệt",
    allRightsReserved: "Mọi quyền được bảo lưu.",
    developedBy: "Phát triển bởi",
  },
  en: {
    warehouseManagement:
      "Management and analysis of heating furnace and heat treatment machine temperature",
    allRightsReserved: "All rights reserved.",
    developedBy: "Developed by",
  },
  zh: {
    warehouseManagement: "加熱爐和熱處理機溫度管理與分析",
    allRightsReserved: "版權所有。",
    developedBy: "開發者",
  },
};

const Footer = () => {
  const { language } = useLanguageStore(); // Lấy ngôn ngữ từ Zustand

  return (
    <footer className="bg-dark text-light text-center py-3 mt-4">
      <Container>
        <Row>
          <Col>
            <p>
              © {new Date().getFullYear()}{" "}
              {locales[language].warehouseManagement}.{" "}
              {locales[language].allRightsReserved}
            </p>
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center align-items-center">
            <span className="me-2">{locales[language].developedBy}</span>
            <a
              href="https://github.com/DaTT2001"
              target="_blank"
              rel="noopener noreferrer"
              className={`text-light d-flex align-items-center ${styles.footerLink}`}
            >
              <i
                className="bi bi-github me-1"
                style={{ fontSize: "1.2rem" }}
              ></i>
              DaTT2001
            </a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
