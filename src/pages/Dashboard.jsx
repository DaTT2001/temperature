import React from "react";
import TemperatureCard from "../components/TemperatureCard";
import { Container, Row, Col } from "react-bootstrap";
import useLanguageStore from "../services/languageStore";
const locales = {
  vi: {
    heatTreat: "Lò xử lý nhiệt",
    reheat: "Lò gia nhiệt",
  },
  en: {
    heatTreat: "Heat Treatment",
    reheat: "Reheating Furnace",
  },
  zh: {
    heatTreat: "熱處理爐",
    reheat: "加熱爐",
  },
};
const Dashboard = () => {
  const { language } = useLanguageStore();
  return (
    <Container>
      <Row className="justify-content-center mb-4">
        <Col xs={12} md={4}>
          <div className="group-title text-center mb-2">{locales[language].heatTreat}</div>
          <div className="d-flex flex-column gap-3 align-items-center">
            <TemperatureCard tableName="t4" />
            <TemperatureCard tableName="t5" />
          </div>
        </Col>
        <Col xs={12} md={8}>
          <div className="group-title text-center mb-2">{locales[language].reheat}</div>
          <div className="d-flex flex-row flex-wrap gap-3 justify-content-center">
            <TemperatureCard tableName="g1" />
            <TemperatureCard tableName="g2" />
            <TemperatureCard tableName="g3" />
          </div>
        </Col>
      </Row>
      <style>
        {`
          .group-title {
            font-size: 1.25rem;
            font-weight: bold;
            background: #f8f9fa;
            border-radius: 8px;
            padding: 8px 0;
            margin-bottom: 8px;
            letter-spacing: 1px;
          }
          .card {
            border-radius: 12px;
          }
        `}
      </style>
    </Container>
  );
};

export default Dashboard;