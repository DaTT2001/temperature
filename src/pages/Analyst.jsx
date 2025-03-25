import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import TemperatureChart from "../components/TemperatureChart";
import { useHistoricalStore } from "../services/historicalStore";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Analyst = () => {
  const { id } = useParams();
  const setSelectedDate = useHistoricalStore((state) => state.setSelectedDate);
  const selectedDate = useHistoricalStore((state) => state.selectedDate);
  const isLiveMode = useHistoricalStore((state) => state.isLiveMode);
  const setLiveMode = useHistoricalStore((state) => state.setLiveMode);

  const [selectedFurnace, setSelectedFurnace] = useState(id || "t4");
  const data = useHistoricalStore(
    (state) => state.dailyData[selectedFurnace] || []
  );

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      console.warn("Không có dữ liệu để xuất!");
      return;
    }

    // Chuẩn bị dữ liệu cho Excel
    const excelData = data.map((entry) => ({
      "Thời gian": entry.timestamp,
      ...entry.sensors.reduce((acc, val, idx) => {
        acc[`Cảm biến ${idx + 1}`] = val;
        return acc;
      }, {}),
    }));

    // Tạo worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Tạo workbook và thêm worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Dữ liệu nhiệt độ");

    // Xuất file Excel
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `TemperatureData_${selectedFurnace}.xlsx`);
  };

  const furnaces = [
    { id: "t4", name: "T4" },
    { id: "t5", name: "T5" },
    { id: "g1", name: "G1" },
    { id: "g2", name: "G2" },
    { id: "g3", name: "G3" },
  ];

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
  const handleLiveMode = () => {
    setLiveMode(true);
    setSelectedDate(new Date()); // Cập nhật ngay lập tức về ngày hôm nay
  };
  return (
    <Container>
      {/* Chế độ hiển thị */}
      <Row className="justify-content-between">
        <Col md={4}>
          <Button
            variant={isLiveMode ? "primary" : "secondary"}
            onClick={handleLiveMode}
          >
            Live View
          </Button>
          <Button
            variant={!isLiveMode ? "primary" : "secondary"}
            onClick={() => setLiveMode(false)}
            className="ms-2"
          >
            History View
          </Button>
        </Col>
        {!isLiveMode && (
          <Col md={4}>
            <Form.Group>
              <Form.Control
                type="date"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
              />
            </Form.Group>
          </Col>
        )}
        <Col md={2}>
          <Form.Group className="mb-3">
            {/* <Form.Label>Chọn Lò</Form.Label> */}
            <Form.Select
              value={selectedFurnace}
              onChange={(e) => setSelectedFurnace(e.target.value)}
              style={{
                cursor: "pointer",
              }}
            >
              {furnaces.map((furnace) => (
                <option key={furnace.id} value={furnace.id}>
                  {furnace.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={2} className="text-end">
          <Button variant="success" onClick={exportToExcel} className="ms-2">
            Export Excel
          </Button>
        </Col>
      </Row>
      {/* Charts và Tables */}
      <Row className="mb-4">
        <Col md={12}>
          <TemperatureChart
            tableName={selectedFurnace}
            mode={isLiveMode ? "live" : "history"}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Analyst;
