import { useEffect, useRef } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

function DateTimePicker({ value, onChange }) {
  const inputRef = useRef(null);
  const fpRef = useRef(null); // Tạo instance riêng cho mỗi DateTimePicker

  useEffect(() => {
    fpRef.current = flatpickr(inputRef.current, {
      enableTime: true,
      time_24hr: true,
      dateFormat: "Y-m-d H:i",
      defaultDate: value || null, // Nếu không có giá trị, để null tránh lỗi
      onChange: (selectedDates) => {
        onChange(selectedDates[0] ? selectedDates[0].toISOString() : "");
      },
    });

    return () => {
      if (fpRef.current) {
        fpRef.current.destroy();
      }
    };
  }, [value]); // Chỉ re-render khi value thay đổi

  const handleClear = (e) => {
    e.stopPropagation(); // Ngăn Flatpickr mở popup khi click
    if (fpRef.current) {
      fpRef.current.clear();
    }
    onChange(""); // Reset state chỉ cho input này
  };

  return (
    <div className="input-group">
      <input ref={inputRef} className="form-control" />
      {value && (
        <button className="btn btn-outline-secondary" onClick={handleClear}>
          ❌
        </button>
      )}
    </div>
  );
}

export default DateTimePicker;
