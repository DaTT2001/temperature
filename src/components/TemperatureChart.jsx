import React, { useMemo, useRef, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card } from 'react-bootstrap';
import { useHistoricalStore } from "../services/historicalStore";

const TemperatureChart = ({tableName}) => {
    const data = useHistoricalStore((state) => state.dailyData[tableName] || []);
    const selectedDate = useHistoricalStore((state) => state.selectedDate);
    const formattedDate = selectedDate.toLocaleDateString('vi-VN');
    const legendStateRef = useRef({});
    const echartsRef = useRef(null);
    const zoomStateRef = useRef({ start: 0, end: 100 });

    // Safe format time function
    const formatTime = (timestamp) => {
        try {
            if (!timestamp) {
                console.warn('Empty timestamp received');
                return '';
            }
            // Handle 12-hour format
            if (typeof timestamp === 'string' && /^\d{1,2}:\d{2}:\d{2}\s[AP]M$/.test(timestamp)) {
                const [time, period] = timestamp.split(' ');
                const [hours, minutes, seconds] = time.split(':');
                let hour = parseInt(hours);
                
                if (period === 'PM' && hour < 12) hour += 12;
                if (period === 'AM' && hour === 12) hour = 0;
                
                return `${hour.toString().padStart(2, '0')}:${minutes}:${seconds}`;
            }

            // Handle PostgreSQL timestamp
            const date = new Date(timestamp);
            if (isNaN(date.getTime())) {
                console.error('Invalid timestamp:', timestamp);
                return '';
            }

            return date.toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            });
        } catch (error) {
            console.error('Error formatting time:', error);
            return '';
        }
    };

    // Safe data zoom handler
    const handleDataZoom = useCallback((params) => {
        try {
            const zoomStart = params.start !== undefined ? params.start : params.batch?.[0]?.start;
            const zoomEnd = params.end !== undefined ? params.end : params.batch?.[0]?.end;

            if (zoomStart !== undefined && zoomEnd !== undefined) {
                zoomStateRef.current = { start: zoomStart, end: zoomEnd };
                
                if (echartsRef.current) {
                    const chartInstance = echartsRef.current.getEchartsInstance();
                    chartInstance.setOption({
                        dataZoom: [{
                            start: zoomStart,
                            end: zoomEnd
                        }, {
                            start: zoomStart,
                            end: zoomEnd
                        }]
                    });
                }
            }
        } catch (error) {
            console.error('Error handling zoom:', error);
        }
    }, []);

    // Safe option generator
    const option = useMemo(() => {
        try {
            if (!data || !Array.isArray(data) || data.length === 0) {
                console.warn(`No data available for ${tableName}`);
                return {
                    title: {
                        text: `TEMPERATURE CHART ${tableName.toUpperCase()}`,
                        subtext: `No data available for ${formattedDate}`,
                        left: 'center'
                    }
                };
            }

            // Validate sensor data
            const validData = data.filter(item => {
                if (!item || !Array.isArray(item.sensors)) {
                    console.warn('Invalid data item:', item);
                    return false;
                }
                return true;
            });

            if (validData.length === 0) {
                console.warn('No valid data points found');
                return {
                    title: {
                        text: `TEMPERATURE CHART ${tableName.toUpperCase()}`,
                        subtext: `Invalid data for ${formattedDate}`,
                        left: 'center'
                    }
                };
            }

            if (!data || data.length === 0) return {};
            const SENSOR_NAMES = [
                'Rex Sensor',
                'PID Controller',
                ...Array.from({ length: 6 }, (_, i) => `Chino Sensor ${i + 1}`)
            ]

            return {
                // ...your existing option object...
                backgroundColor: 'white',
            title: {
                text: `TEMPERATURE CHART ${tableName.toUpperCase()}`,
                subtext: `Date: ${formattedDate}`,
                left: 'center',
                top: 15,
                textStyle: {
                    color: '#000',
                    fontSize: '24',
                    fontWeight: 'bold',
                    fontFamily: 'Roboto, Arial, sans-serif'
                },
                subtextStyle: {
                    color: '#000',
                    fontSize: '14',
                    fontFamily: 'Roboto, Arial, sans-serif',
                    padding: [8, 0]
                },
                padding: [0, 0, 40, 0]
            },
            grid: {
                top: 150,
                bottom: 80,
                left: '5%',
                right: '5%',
                containLabel: true,
                borderColor: 'black',
                backgroundColor: '#ffffff',
                show: true,
                borderWidth: 1
            },
            legend: {
                type: 'scroll',
                // data: Array.from({ length: 8 }, (_, i) => `Cảm biến ${i + 1}`),
                data: SENSOR_NAMES,
                top: 80,
                selected: legendStateRef.current,
                textStyle: {
                    color: '#333333',
                    fontSize: '12',
                    fontFamily: 'Roboto, Arial, sans-serif'
                },
                pageTextStyle: { color: '#333333' },
                pageIconColor: '#999999',
                pageIconInactiveColor: '#cccccc',
                borderWidth: 1,
                borderColor: '#e0e0e0',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: [8, 12]
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    label: { backgroundColor: 'black' }
                },
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: 'black',
                textStyle: { color: 'black' },
                borderWidth: 1
            },
            toolbox: {
                right: '10px',
                feature: {
                    dataZoom: {
                        yAxisIndex: 'none',
                        iconStyle: { borderColor: 'black' }
                    },
                    restore: {
                        iconStyle: { borderColor: 'black' }
                    },
                    saveAsImage: {
                        type: ['png'],
                        name: `Temperature_Chart_${formattedDate}`,
                        backgroundColor: '#ffffff',
                        iconStyle: { borderColor: 'black' }
                    },
                    myFullScreen: {  // Đổi tên để tránh xung đột
                        show: true,
                        title: 'Full Screen',
                        icon: 'path://M176,24H72A24,24,0,0,0,48,48V152a8,8,0,0,0,16,0V48a8,8,0,0,1,8-8H176a8,8,0,0,0,0-16Z M208,48V152a8,8,0,0,0,16,0V48a24,24,0,0,0-24-24H96a8,8,0,0,0,0,16h96A8,8,0,0,1,208,48Z',
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
                            borderColor: 'black',
                            color: 'black'
                        }
                    }
                }
            },
            dataZoom: [{
                type: 'slider',
                xAxisIndex: 0,
                realtime: true,
                start: zoomStateRef.current.start,
                end: zoomStateRef.current.end,
                height: 25,
                bottom: 25,
                borderColor: '#000000',
                backgroundColor: '#ffffff',
                fillerColor: 'rgba(54, 153, 255, 0.2)',
                dataBackground: {
                    lineStyle: {
                        color: '#000000',
                        width: 1
                    },
                    areaStyle: {
                        color: '#e0e0e0'
                    }
                },
                selectedDataBackground: {
                    lineStyle: {
                        color: '#3699FF',
                        width: 2
                    },
                    areaStyle: {
                        color: '#e6f3ff'
                    }
                },
                handleStyle: {
                    color: '#3699FF',
                    borderColor: '#000000',
                    borderWidth: 1,
                    borderCap: 'round',
                    opacity: 0.8
                },
                moveHandleStyle: {
                    color: '#3699FF',
                    opacity: 0.9
                },
                emphasis: {
                    handleStyle: {
                        color: '#3699FF',
                        borderColor: '#000000',
                        borderWidth: 2,
                        opacity: 1
                    }
                },
                textStyle: {
                    color: '#000000'
                }
            }, {
                type: 'inside',
                xAxisIndex: 0,
                start: zoomStateRef.current.start,
                end: zoomStateRef.current.end,
                minValueSpan: 10,
                zoomLock: false
            }],
            xAxis: {
                type: 'category',
                data: data.map(d => formatTime(d.timestamp)),
                boundaryGap: false,
                axisLine: {
                    lineStyle: {
                        color: 'black',
                        width: 2
                    }
                },
                axisLabel: {
                    color: 'black',
                    fontSize: 12
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#f0f0f0',
                        type: 'dashed'
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: 'Temp (°C)',
                nameLocation: 'middle',
                nameGap: 50,
                nameTextStyle: {
                    color: 'black',
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                axisLine: {
                    lineStyle: {
                        color: 'black',
                        width: 2
                    }
                },
                axisLabel: {
                    color: 'black',
                    fontSize: 12
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: '#ccc',
                        type: 'dashed'
                    }
                }
            },
                series: Array.from({ length: 8 }, (_, i) => ({
                    name: SENSOR_NAMES[i],
                    type: 'line',
                    data: validData.map(d => {
                        const value = d.sensors[i];
                        // Handle invalid temperature values
                        if (typeof value !== 'number' || isNaN(value)) {
                            console.warn(`Invalid temperature value for sensor ${i}:`, value);
                            return null;
                        }
                        return value;
                    }),
                    // ...rest of series config...
                }))
            };
        } catch (error) {
            console.error('Error generating chart options:', error);
            return {
                title: {
                    text: `TEMPERATURE CHART ${tableName.toUpperCase()}`,
                    subtext: 'Error loading chart data',
                    left: 'center'
                }
            };
        }
    }, [data, formattedDate, tableName]);

    // Safe render
    return (
        <Card style={{
            border: '1px solid #000000',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <Card.Body>
                <ReactECharts
                    ref={echartsRef}
                    option={option}
                    notMerge={false}
                    lazyUpdate={true}
                    onEvents={{
                        'legendselectchanged': (params) => {
                            try {
                                legendStateRef.current = params.selected;
                            } catch (error) {
                                console.error('Error handling legend change:', error);
                            }
                        },
                        'datazoom': handleDataZoom,
                        'error': (e) => {
                            console.error('Chart error:', e);
                        }
                    }}
                    style={{ 
                        height: '600px',
                        width: '100%',
                        maxWidth: '100%'
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