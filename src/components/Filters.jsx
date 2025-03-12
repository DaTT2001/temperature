import React from 'react'
import { Form, InputGroup, Offcanvas } from 'react-bootstrap'

const Filters = (showFilter, setShowFilter ) => {
    const handleStartTimeChange = (value) => {
        setIsTyping(true);
        setTimeRange(prev => ({ ...prev, startTime: value }));
        setTimeout(() => setIsTyping(false), 1000);
      };
    
    const handleEndTimeChange = (value) => {
        setIsTyping(true);
        setTimeRange(prev => ({ ...prev, endTime: value }));
        setTimeout(() => setIsTyping(false), 1000);
    };
  return (
    <>
        <Offcanvas show={showFilter} onHide={() => setShowFilter(false)} placement="end">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Bộ lọc dữ liệu</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form.Group controlId="selectTable">
              <Form.Label><strong>Chọn lò</strong></Form.Label>
              <InputGroup>
                <InputGroup.Text>🔥</InputGroup.Text>
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

            <Form.Group controlId="startTime" className="mt-3">
              <Form.Label><strong>Thời gian bắt đầu</strong></Form.Label>
              <InputGroup>
                <InputGroup.Text><FaCalendarAlt /></InputGroup.Text>
                <DateTimePicker value={timeRange.startTime} onChange={handleStartTimeChange} />
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="endTime" className="mt-3">
              <Form.Label><strong>Thời gian kết thúc</strong></Form.Label>
              <InputGroup>
                <InputGroup.Text><FaClock /></InputGroup.Text>
                <DateTimePicker value={timeRange.endTime} onChange={handleEndTimeChange} />
              </InputGroup>
            </Form.Group>

            <Button variant="secondary" className="mt-4 w-100" onClick={() => setShowFilter(false)}>
              Áp dụng
            </Button>
          </Offcanvas.Body>
        </Offcanvas>
    </>
  )
}

export default Filters