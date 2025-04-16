import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import TemperatureChart from "../components/TemperatureChart";
import { useHistoricalStore } from "../services/historicalStore";
import { useParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import useLanguageStore from "../services/languageStore";
import { formatTime } from "../utils/constants";
import { useNavigate } from "react-router-dom";

// Add translations
function getDateString(date) {
  if (!(date instanceof Date)) {
    throw new Error("Tham số không phải là đối tượng Date");
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const locales = {
  vi: {
    liveView: "Xem Trực Tiếp",
    historyView: "Xem Lịch Sử",
    selectFurnace: "Chọn Lò",
    furnacePrefix: "Lò",
    export: "Xuất Excel",
    noData: "Không có dữ liệu để xuất!",
    invalidDate: "Giá trị ngày không hợp lệ:",
    dateError: "Lỗi khi thay đổi ngày:",
    excel: {
      time: "Thời gian",
      sensors: {
        rex: "Cảm biến 1",
        pid: "Cảm biến 2",
        chino: "Cảm biến",
      },
      sheetName: "Dữ liệu nhiệt độ",
      fileName: "NhietDo",
      a: "vi",
    },
  },
  en: {
    liveView: "Live View",
    historyView: "History View",
    selectFurnace: "Select Furnace",
    furnacePrefix: "Furnace",
    export: "Export Excel",
    noData: "No data to export!",
    invalidDate: "Invalid date value:",
    dateError: "Error changing date:",
    excel: {
      time: "Time",
      sensors: {
        rex: "Sensor 1",
        pid: "Sensor 2",
        chino: "Sensor",
      },
      sheetName: "Temperature Data",
      fileName: "Temperature",
      a: "en",
    },
  },
  zh: {
    liveView: "實時查看",
    historyView: "歷史查看",
    selectFurnace: "選擇爐子",
    furnacePrefix: "爐",
    export: "導出Excel",
    noData: "沒有數據可導出！",
    invalidDate: "無效的日期值：",
    dateError: "更改日期時出錯：",
    excel: {
      time: "時間",
      sensors: {
        rex: "感測器 1",
        pid: "感測器 2",
        chino: "感測器",
      },
      sheetName: "溫度數據",
      fileName: "溫度",
      a: "zh",
    },
  },
};

const Analyst = () => {
  const { id } = useParams();
  // const setSelectedDate = useHistoricalStore((state) => state.setSelectedDate);
  const selectedDate = useHistoricalStore((state) => state.selectedDate);
  const isLiveMode = useHistoricalStore((state) => state.isLiveMode);
  const setLiveMode = useHistoricalStore((state) => state.setLiveMode);
  const fetchHistoricalData = useHistoricalStore((state) => state.fetchHistoricalData);
  const { language } = useLanguageStore();
  const navigate = useNavigate();

  const [selectedFurnace, setSelectedFurnace] = useState(id || "t4");
  const data = useHistoricalStore(
    (state) => state.dailyData[selectedFurnace] || []
  );
  
  useEffect(() => {
    if (isLiveMode) {
      setLiveMode(true); // Đảm bảo state được cập nhật
    }
  }, []);

  const handleFurnaceChange = (e) => {
    const newFurnace = e.target.value;
    setSelectedFurnace(newFurnace);
    navigate(`/analyst/${newFurnace}`);
    console.log(isLiveMode);
    
    if(isLiveMode) {
      window.location.reload(); // Reload lại trang
    }
  };

  const exportToExcel = () => {
    if (!data || data.length === 0) {
      console.warn(locales[language].noData);
      return;
    }

    // Chuẩn bị dữ liệu cho Excel
    const excelData = data.map((entry) => ({
      [locales[language].excel.time]: formatTime(entry.timestamp), // Cột 1: Timestamp
      [locales[language].excel.sensors.rex]: entry.sensors[0], // Cột 2: Rex Sensor
      [locales[language].excel.sensors.pid]: entry.sensors[1], // Cột 3: PID Controller
      // Cột 4 - 9: Chino Sensor 1 - 6 (từ sensors[2] đến sensors[7])
      [`${locales[language].excel.sensors.chino} 3`]: entry.sensors[2],
      [`${locales[language].excel.sensors.chino} 4`]: entry.sensors[3],
      [`${locales[language].excel.sensors.chino} 5`]: entry.sensors[4],
      [`${locales[language].excel.sensors.chino} 6`]: entry.sensors[5],
      [`${locales[language].excel.sensors.chino} 7`]: entry.sensors[6],
      [`${locales[language].excel.sensors.chino} 8`]: entry.sensors[7],
    }));

    // Tạo worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Tạo workbook và thêm worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      `${locales[language].excel.sheetName}_${selectedFurnace}_${getDateString(
        selectedDate
      )}`
    );

    // Xuất file Excel
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(
      blob,
      `TemperatureData_${selectedFurnace}_${getDateString(selectedDate)}_${
        locales[language].excel.a
      }.xlsx`
    );
  };

  const furnaces = [
    { id: "t4", name: "T4" },
    { id: "t5", name: "T5" },
    { id: "g1", name: "1600T" },
    { id: "g2", name: "1000T" },
    { id: "g3", name: "400T" },
  ];
  const handleDateChange = (e) => {
    try {
      const newDate = new Date(e.target.value);
      if (!isNaN(newDate.getTime())) {
        setLiveMode(false);
        fetchHistoricalData(newDate);
      } else {
        console.error(locales[language].invalidDate, e.target.value);
      }
    } catch (error) {
      console.error(locales[language].dateError, error);
    }
  };

  const handleLiveMode = () => {
    if (!isLiveMode) {
      setLiveMode(true);
    }
  };
  return (
    <Container className="px-2 px-sm-3 px-md-4">
      {/* Chế độ hiển thị */}
      <Row className="justify-content-between g-2 mb-3">
        <Col xs={12} sm={6} md={4} lg={3}>
          <Button
            variant={isLiveMode ? "primary" : "secondary"}
            onClick={handleLiveMode}
          >
            {locales[language].liveView}
          </Button>
          <Button
            variant={!isLiveMode ? "primary" : "secondary"}
            onClick={() => setLiveMode(false)}
            className="ms-2"
          >
            {locales[language].historyView}
          </Button>
        </Col>
        {!isLiveMode && (
          <Col xs={12} sm={6} md={3} lg={3}>
            <Form.Group>
              <Form.Control
                type="date"
                value={selectedDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
              />
            </Form.Group>
          </Col>
        )}
        <Col xs={6} sm={6} md={3} lg={3}>
          <Form.Group className="mb-3">
            {/* <Form.Label>Chọn Lò</Form.Label> */}
            <Form.Select
              value={selectedFurnace}
              onChange={handleFurnaceChange}
              style={{
                cursor: "pointer",
              }}
            >
              {furnaces.map((furnace) => (
                <option key={furnace.id} value={furnace.id}>
                  {`${locales[language].furnacePrefix} ${furnace.name}`}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={6} sm={6} md={2} lg={3} className="text-end">
          <Button variant="success" onClick={exportToExcel} className="ms-2">
            {locales[language].export}
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
