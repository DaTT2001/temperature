import React, {
  useMemo,
  useRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import ReactECharts from "echarts-for-react";
import { Card } from "react-bootstrap";
import { useHistoricalStore } from "../services/historicalStore";
import useLanguageStore from "../services/languageStore";
import { formatTime } from "../utils/constants";
// Add translations object
const locales = {
  vi: {
    title: "BIỂU ĐỒ NHIỆT ĐỘ",
    date: "Ngày",
    noData: "Không có dữ liệu cho",
    error: "Lỗi tải dữ liệu",
    sensors: {
      rex: "Cảm biến 1",
      pid: "Cảm biến 2",
      chino: "Cảm biến",
    },
    temp: "Nhiệt độ (°C)",
    fullscreen: "Toàn màn hình",
  },
  en: {
    title: "TEMPERATURE CHART",
    date: "Date",
    noData: "No data available for",
    error: "Error loading data",
    sensors: {
      rex: "Sensor 1",
      pid: "Sensor 2",
      chino: "Sensor",
    },
    temp: "Temperature (°C)",
    fullscreen: "Full Screen",
  },
  zh: {
    title: "温度图表",
    date: "日期",
    noData: "没有可用数据",
    error: "加载数据出错",
    sensors: {
      rex: "感測器 1",
      pid: "感測器 2",
      chino: "感測器",
    },
    temp: "温度 (°C)",
    fullscreen: "全屏",
  },
};
const furnaces = [
  { id: "t4", name: "T4" },
  { id: "t5", name: "T5" },
  { id: "g1", name: "1600T" },
  { id: "g2", name: "1000T" },
  { id: "g3", name: "400T" },
];

const TemperatureChart = ({ tableName }) => {
  const selectedFurnace = furnaces.find(f => f.id === tableName);
  
  const data = useHistoricalStore((state) => state.dailyData[tableName] || []);
  const selectedDate = useHistoricalStore((state) => state.selectedDate);
  const formattedDate = selectedDate.toLocaleDateString("vi-VN");
  const legendStateRef = useRef({});
  const echartsRef = useRef(null);
  const zoomStateRef = useRef({ start: 0, end: 100 });
  const [chartHeight, setChartHeight] = useState("600px");

  const { language } = useLanguageStore();

  // Theo dõi resize window
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 576) {
        // xs
        setChartHeight("400px");
      } else if (width < 768) {
        // sm
        setChartHeight("450px");
      } else if (width < 992) {
        // md
        setChartHeight("500px");
      } else {
        // lg and above
        setChartHeight("600px");
      }
    };

    // Initial check
    handleResize();

    // Add listener
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Safe data zoom handler
  const handleDataZoom = useCallback((params) => {
    try {
      const zoomStart =
        params.start !== undefined ? params.start : params.batch?.[0]?.start;
      const zoomEnd =
        params.end !== undefined ? params.end : params.batch?.[0]?.end;

      if (zoomStart !== undefined && zoomEnd !== undefined) {
        zoomStateRef.current = { start: zoomStart, end: zoomEnd };

        if (echartsRef.current) {
          const chartInstance = echartsRef.current.getEchartsInstance();
          chartInstance.setOption({
            dataZoom: [
              {
                start: zoomStart,
                end: zoomEnd,
              },
              {
                start: zoomStart,
                end: zoomEnd,
              },
            ],
          });
        }
      }
    } catch (error) {
      console.error("Error handling zoom:", error);
    }
  }, []);

  // Safe option generator
  const option = useMemo(() => {
    try {
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.warn(`No data available for ${tableName}`);
        return {
          title: {
            text: `${locales[language].title} ${tableName.toUpperCase()}`,
            subtext: `${locales[language].noData} ${formattedDate}`,
            left: "center",
          },
        };
      }

      // Validate sensor data
      const validData = data.filter((item) => {
        if (!item || !Array.isArray(item.sensors)) {
          console.warn("Invalid data item:", item);
          return false;
        }
        return true;
      });

      if (validData.length === 0) {
        console.warn("No valid data points found");
        return {
          title: {
            text: `TEMPERATURE CHART ${selectedFurnace.name.toUpperCase()}`,
            subtext: `Invalid data for ${formattedDate}`,
            left: "center",
          },
        };
      }

      if (!data || data.length === 0) return {};
      const SENSOR_NAMES = [
        locales[language].sensors.rex,
        locales[language].sensors.pid,
        ...Array.from(
          { length: 6 },
          (_, i) => `${locales[language].sensors.chino} ${i + 3}`
        ),
      ];

      return {
        // ...your existing option object...
        backgroundColor: "white",
        title: {
          text: `${locales[language].title} ${selectedFurnace.name.toUpperCase()}`,
          subtext: `${locales[language].date}: ${formattedDate}`,
          left: "center",
          top: window.innerWidth < 769 ? 50 : 15,
          textStyle: {
            color: "#000",
            fontSize: window.innerWidth < 576 ? "18" : "24",
            fontWeight: "bold",
            fontFamily: "Roboto, Arial, sans-serif",
          },
          subtextStyle: {
            color: "#000",
            fontSize: window.innerWidth < 576 ? "12" : "14",
            fontFamily: "Roboto, Arial, sans-serif",
            padding: [4, 0],
          },
          padding: [0, 0, 40, 0],
        },
        grid: {
          top: window.innerWidth < 576 ? 140 : 150,
          bottom: window.innerWidth < 576 ? 60 : 80,
          left: window.innerWidth < 576 ? "8%" : "5%",
          right: window.innerWidth < 576 ? "5%" : "5%",
          containLabel: true,
          borderColor: "black",
          backgroundColor: "#ffffff",
          show: true,
          borderWidth: 1,
        },
        legend: {
          type: "scroll",
          // data: Array.from({ length: 8 }, (_, i) => `Cảm biến ${i + 1}`),
          data: SENSOR_NAMES,
          top: window.innerWidth < 769 ? 100 : 80,
          orient: window.innerWidth < 576 ? "horizontal" : "horizontal",
          selected: legendStateRef.current,
          textStyle: {
            color: "#333333",
            fontSize: window.innerWidth < 576 ? "10" : "12",
            fontFamily: "Roboto, Arial, sans-serif",
          },
          pageTextStyle: { color: "#333333" },
          pageIconColor: "#999999",
          pageIconInactiveColor: "#cccccc",
          borderWidth: 1,
          borderColor: "#e0e0e0",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: [8, 12],
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: { backgroundColor: "black" },
          },
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderColor: "black",
          textStyle: { color: "black" },
          borderWidth: 1,
        },
        toolbox: {
          right: window.innerWidth < 576 ? "5px" : "10px",
          // Move toolbox down on mobile
          top: window.innerWidth < 769 ? "5px" : "15px",
          itemSize: window.innerWidth < 769 ? 15 : 20,
          feature: {
            saveAsImage: {
              type: ["png"],
              name: `Temperature_Chart_${formattedDate}`,
              backgroundColor: "#ffffff",
              iconStyle: { borderColor: "black" },
            },
            myFullScreen: {
              // Đổi tên để tránh xung đột
              show: true,
              title: locales[language].fullscreen,
              icon: "path://M176,24H72A24,24,0,0,0,48,48V152a8,8,0,0,0,16,0V48a8,8,0,0,1,8-8H176a8,8,0,0,0,0-16Z M208,48V152a8,8,0,0,0,16,0V48a24,24,0,0,0-24-24H96a8,8,0,0,0,0,16h96A8,8,0,0,1,208,48Z",
              onclick: () => {
                if (echartsRef.current) {
                  const chartDom = echartsRef.current.ele;
                  if (chartDom) {
                    if (!document.fullscreenElement) {
                      chartDom.requestFullscreen();
                    } else {
                      document.exitFullscreen();
                    }
                  }
                }
              },
              iconStyle: {
                borderColor: "black",
                color: "black",
              },
            },
          },
        },
        dataZoom: [
          {
            type: "slider",
            xAxisIndex: 0,
            realtime: true,
            start: zoomStateRef.current.start,
            end: zoomStateRef.current.end,
            height: window.innerWidth < 576 ? 20 : 25,
            bottom: window.innerWidth < 576 ? 15 : 25,
            borderColor: "#000000",
            backgroundColor: "#ffffff",
            fillerColor: "rgba(54, 153, 255, 0.2)",
            dataBackground: {
              lineStyle: {
                color: "#000000",
                width: 1,
              },
              areaStyle: {
                color: "#e0e0e0",
              },
            },
            selectedDataBackground: {
              lineStyle: {
                color: "#3699FF",
                width: 2,
              },
              areaStyle: {
                color: "#e6f3ff",
              },
            },
            handleStyle: {
              color: "#3699FF",
              borderColor: "#000000",
              borderWidth: 1,
              borderCap: "round",
              opacity: 0.8,
            },
            moveHandleStyle: {
              color: "#3699FF",
              opacity: 0.9,
            },
            emphasis: {
              handleStyle: {
                color: "#3699FF",
                borderColor: "#000000",
                borderWidth: 2,
                opacity: 1,
              },
            },
            textStyle: {
              color: "#000000",
            },
          },
          {
            type: "inside",
            xAxisIndex: 0,
            start: zoomStateRef.current.start,
            end: zoomStateRef.current.end,
            minValueSpan: 10,
            zoomLock: false,
          },
        ],
        xAxis: {
          type: "category",
          data: data.map((d) => formatTime(d.timestamp)),
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: "black",
              width: 2,
            },
          },
          axisLabel: {
            color: "black",
            fontSize: 12,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#f0f0f0",
              type: "dashed",
            },
          },
        },
        yAxis: {
          type: "value",
          name: locales[language].temp,
          nameLocation: "middle",
          nameGap: 50,
          nameTextStyle: {
            color: "black",
            fontSize: 14,
            fontWeight: "bold",
          },
          axisLine: {
            lineStyle: {
              color: "black",
              width: 2,
            },
          },
          axisLabel: {
            color: "black",
            fontSize: 12,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "#ccc",
              type: "dashed",
            },
          },
        },
        series: Array.from({ length: 8 }, (_, i) => ({
          name: SENSOR_NAMES[i],
          type: "line",
          data: validData.map((d) => {
            const value = d.sensors[i];
            // Handle invalid temperature values
            if (typeof value !== "number" || isNaN(value)) {
              console.warn(`Invalid temperature value for sensor ${i}:`, value);
              return null;
            }
            return value;
          }),
          // ...rest of series config...
        })),
      };
    } catch (error) {
      console.error("Error generating chart options:", error);
      return {
        title: {
          text: `${locales[language].title} ${tableName.toUpperCase()}`,
          subtext: locales[language].error,
          left: "center",
        },
      };
    }
  }, [data, formattedDate, tableName, window.innerWidth, language]);

  // Safe render
  return (
    <Card
      style={{
        border: "1px solid #000000",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Card.Body>
        <ReactECharts
          ref={echartsRef}
          option={option}
          notMerge={false}
          lazyUpdate={true}
          onEvents={{
            legendselectchanged: (params) => {
              try {
                legendStateRef.current = params.selected;
              } catch (error) {
                console.error("Error handling legend change:", error);
              }
            },
            datazoom: handleDataZoom,
            error: (e) => {
              console.error("Chart error:", e);
            },
          }}
          style={{
            height: chartHeight,
            width: "100%",
            maxWidth: "100%",
          }}
          onChartReady={() => {
            console.log(`Chart ready for ${tableName}`);
          }}
        />
      </Card.Body>
    </Card>
  );
};

export default TemperatureChart;
