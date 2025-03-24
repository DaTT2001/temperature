import React from "react";
import TemperatureCard from "../components/TemperatureCard";
import { Container, Row, Col } from "react-bootstrap";

const Dashboard = () => {
  return (
    <Container>
      {/* Temperature Cards - Sử dụng realtime store */}
      <Row className="g-4">
        <Col md={4}>
          <TemperatureCard tableName="t4" />
        </Col>
        <Col md={4}>
          <TemperatureCard tableName="g2" />
        </Col>
        <Col md={4}>
          <TemperatureCard tableName="g3" />
        </Col>
        <Col md={4}>
          <TemperatureCard tableName="g1" />
        </Col>
        <Col md={4}>
          <TemperatureCard tableName="t5" />
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
