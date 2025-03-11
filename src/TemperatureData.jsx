import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Card, InputGroup } from "react-bootstrap";
import DateTimePicker from "./DateTimePicker";
import { FaCalendarAlt, FaClock } from 'react-icons/fa';
import { supabase } from "../src/config/supabaseClient";
import { useTable } from "../src/context/TableContext"; 
import TemperatureChart from "./components/TemperatureChart";
import RealTimeTemperature from "./RealTimeTemperature";
import { useTemperature } from "./context/TemperatureContext";


function parseTimestampToMillis(timestampStr) {
  // Chuyển "15:49:01 10/3/2025" => UNIX timestamp (milliseconds)
  const [time, date] = timestampStr.split(" ");
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const [day, month, year] = date.split("/").map(Number);
  
  return new Date(year, month - 1, day, hours, minutes, seconds).getTime();
}

function downsampleData(data, numPoints) {
  if (data.length <= numPoints) return data;

  // Convert timestamps về milliseconds
  data.forEach(d => d.timestamp_ms = parseTimestampToMillis(d.timestamp));

  // Sắp xếp theo thời gian tăng dần
  data.sort((a, b) => a.timestamp_ms - b.timestamp_ms);

  const startTime = data[0].timestamp_ms;
  const endTime = data[data.length - 1].timestamp_ms;
  const step = (endTime - startTime) / (numPoints - 1); // Chia đều numPoints khoảng

  let result = [data[0]]; // Giữ điểm đầu tiên
  let targetTime = startTime + step;

  for (let i = 1; i < numPoints - 1; i++) {
      let closest = data.reduce((prev, curr) =>
          Math.abs(curr.timestamp_ms - targetTime) < Math.abs(prev.timestamp_ms - targetTime) ? curr : prev
      );
      result.push(closest);
      targetTime += step;
  }

  result.push(data[data.length - 1]); // Giữ điểm cuối cùng

  return result;
}

function TemperatureData({darkMode}) {
  const [ data, setData ] = useState([]);
  const [ error, setError ] = useState(null);
  const { selectedTable, setSelectedTable } = useTable();
  const { latestTemperature } = useTemperature();
  const [ timeRange, setTimeRange ] = useState(() => {
    try {
      const savedRange = localStorage.getItem("timeRange");
      return savedRange ? JSON.parse(savedRange) : { startTime: "", endTime: "" };
    } catch (error) {
      console.error("Lỗi khi đọc timeRange từ localStorage:", error);
      return { startTime: "", endTime: "" };
    }
  });
  
  useEffect(() => {
    try {
      localStorage.setItem("timeRange", JSON.stringify(timeRange));
    } catch (error) {
      console.error("Lỗi khi lưu timeRange vào localStorage:", error);
    }
  }, [timeRange]);

  useEffect(() => {
    async function fetchData() {
  
      let query = supabase
        .from(selectedTable)
        .select("*")
        .order("timestamp", { ascending: true });
  
      const hasFilter = timeRange.startTime || timeRange.endTime;
  
      if (timeRange.startTime) {
        query = query.gte("timestamp", new Date(timeRange.startTime).toISOString());
      }
  
      if (timeRange.endTime) {
        query = query.lte("timestamp", new Date(timeRange.endTime).toISOString());
      }
  
      const { data, error } = await query;
  
      if (error) {
        setError(error.message);
      } else {
        // Chuyển timestamp từ UTC về GMT+7
        const processedData = data.map(row => ({
          ...row,
          timestamp: new Date(row.timestamp).toLocaleString("vi-VN", {
            timeZone: "Asia/Bangkok"
          })
        }));
  
        // Kiểm tra có filter không
        if (hasFilter) {
          setData(downsampleData(processedData, 15)); // Giảm số điểm nếu filter
        } else {
          setData(processedData.slice(-15)); // Lấy 15 giá trị mới nhất nếu không filter
        }
      }
    }
  
    fetchData(); // Fetch ngay khi vào
  
    // Nếu không có filter -> tự động fetch mỗi 5 giây
    let interval = null;
    if (!timeRange.startTime && !timeRange.endTime) {
      interval = setInterval(fetchData, 5000);
    }
  
    return () => {
      if (interval) clearInterval(interval); // Xóa interval khi component unmount hoặc có filter
    };
  
  }, [selectedTable, timeRange]);
  
  return (
    <Container data-bs-theme={darkMode ? "dark" : "light"} className="p-4" style={{ minHeight: "100vh" }}>
      {/* Chọn bảng và thời gian lọc */}
      <Row className="mb-3">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Row className="g-3">  
                {/* Chọn bảng lò */}
                <Col md={4}>
                  <Form.Group controlId="selectTable">
                    <Form.Label><strong>Select</strong></Form.Label>
                    <InputGroup>
                      <InputGroup.Text>🔥</InputGroup.Text> {/* Icon lò */}
                      <Form.Select
                        value={selectedTable}
                        onChange={(e) => setSelectedTable(e.target.value)}
                        className="shadow-sm"
                      >
                        <option value="t1">T1</option>
                        <option value="t2">T2</option>
                        <option value="t3">T3</option>
                        <option value="t4">T4</option>
                        <option value="t5">T5</option>
                      </Form.Select>
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="startTime">
                    <Form.Label><strong>Start time</strong></Form.Label>
                    <InputGroup style={{ flexWrap: "nowrap" }}>
                      <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                      <DateTimePicker
                        value={timeRange.startTime}
                        onChange={(value) => setTimeRange((prev) => ({ ...prev, startTime: value }))}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group controlId="endTime">
                    <Form.Label><strong>End time</strong></Form.Label>
                    <InputGroup style={{ flexWrap: "nowrap" }}>
                      <InputGroup.Text><FaClock /></InputGroup.Text>
                      <DateTimePicker
                        value={timeRange.endTime}
                        onChange={(value) => setTimeRange((prev) => ({ ...prev, endTime: value }))}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>

              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}> 
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="text-center">🌡 Overall Temperature</h5>
              <h3 className="text-center text-primary">
                {(() => {
                  // Lấy danh sách nhiệt độ từ 6 sensor
                  const temps = [
                    latestTemperature.sensor1_temperature,
                    latestTemperature.sensor2_temperature,
                    latestTemperature.sensor3_temperature,
                    latestTemperature.sensor4_temperature,
                    latestTemperature.sensor5_temperature,
                    latestTemperature.sensor6_temperature
                  ];

                  // Lọc bỏ giá trị null/undefined
                  const validTemps = temps.filter(t => t !== null && t !== undefined);

                  // Tính trung bình
                  const avgTemp = validTemps.length > 0
                    ? (validTemps.reduce((sum, t) => sum + t, 0) / validTemps.length).toFixed(1)
                    : "N/A";

                  return `${avgTemp}°C`;
                })()}
              </h3>
            </Card.Body>
          </Card>
        </Col>

      </Row>

      {/* Hiển thị biểu đồ */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <TemperatureChart data={data} darkMode={darkMode} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <RealTimeTemperature/>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Hiển thị lỗi nếu có */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Card className="shadow-sm border-danger">
              <Card.Body>
                <Card.Text className="text-danger">Lỗi: {error}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
export default TemperatureData;