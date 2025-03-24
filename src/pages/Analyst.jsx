import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import TemperatureChart from "../components/TemperatureChart";
import { useHistoricalStore } from "../services/historicalStore";

const Analyst = () => {
  const setSelectedDate = useHistoricalStore((state) => state.setSelectedDate);
  const selectedDate = useHistoricalStore((state) => state.selectedDate);

  const handleDateChange = (e) => {
    try {
      const newDate = new Date(e.target.value);
      if (!isNaN(newDate.getTime())) {
        setSelectedDate(newDate);
      } else {
        console.error("Giá trị ngày không hợp lệ:", e.target.value);
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi ngày:", error);
    }
  };

  return (
    <Container>
      {/* Date Picker - Sử dụng historical store */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Chọn ngày</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate.toISOString().split("T")[0]}
              onChange={handleDateChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Charts và Tables - Sử dụng historical store */}
      <Row className="mb-4">
        <Col md={12}>
          <TemperatureChart tableName="t4" />
        </Col>
      </Row>
    </Container>
  );
};

export default Analyst;
