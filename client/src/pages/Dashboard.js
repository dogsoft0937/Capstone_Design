import React, { useEffect, useState } from 'react';
import '../css/Dashboard.css';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
    const [deviceData, setDeviceData] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            console.log("웹소켓 연결 성공");
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type === 'trap') {
                    // SNMP 트랩 데이터 처리
                    const trapInfo = data.data;
                    console.log("SNMP 트랩 수신:", trapInfo);
                    
                    // 장치 정보 업데이트
                    setDeviceData(prevData => ({
                        deviceInfo: {
                            deviceName: trapInfo.source,
                            deviceIP: trapInfo.source,
                            status: "Online",
                            lastChecked: trapInfo.timestamp
                        },
                        portInfo: trapInfo.varbinds
                            .filter(vb => vb.oid.startsWith('1.3.6.1.2.1.2.2.1.8.'))
                            .map(vb => ({
                                portNumber: vb.oid.split('.').pop(),
                                portStatus: vb.value === 1 ? "Up" : "Down",
                                traffic: "N/A",
                                errorCount: 0
                            })),
                        trafficStats: {
                            inboundTraffic: "0MB",
                            outboundTraffic: "0MB"
                        },
                        event: {
                            eventType: "Trap",
                            severity: "Warning",
                            message: `SNMP Trap received from ${trapInfo.source}`
                        }
                    }));
                }
            } catch (error) {
                console.error("데이터 파싱 오류:", error);
            }
        };

        socket.onclose = () => {
            console.log("웹소켓 연결이 닫혔습니다");
        };

        socket.onerror = (error) => {
            console.error("웹소켓 오류:", error);
        };

        return () => socket.close();
    }, []);

    if (!deviceData) return <p>데이터 로딩 중...</p>;

    const trafficData = {
        labels: ['Inbound', 'Outbound'],
        datasets: [
            {
                label: 'Traffic (MB)',
                data: [
                    parseInt(deviceData.trafficStats.inboundTraffic.replace('MB', '')),
                    parseInt(deviceData.trafficStats.outboundTraffic.replace('MB', ''))
                ],
                backgroundColor: ['#42a5f5', '#66bb6a']
            }
        ]
    };

    return (
        <div className="dashboard">
            <h1>실시간 대시보드</h1>

            <section>
                <h2>장치 정보</h2>
                <p>이름: {deviceData.deviceInfo.deviceName}</p>
                <p>IP: {deviceData.deviceInfo.deviceIP}</p>
                <p>상태: {deviceData.deviceInfo.status}</p>
                <p>마지막 확인 시간: {new Date(deviceData.deviceInfo.lastChecked).toLocaleString()}</p>
            </section>

            <section>
                <h2>포트 상태</h2>
                <table>
                    <thead>
                        <tr>
                            <th>포트 번호</th>
                            <th>상태</th>
                            <th>트래픽</th>
                            <th>오류 개수</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deviceData.portInfo.map((port, index) => (
                            <tr key={index}>
                                <td>{port.portNumber}</td>
                                <td>{port.portStatus}</td>
                                <td>{port.traffic}</td>
                                <td>{port.errorCount}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section>
                <h2>트래픽 통계</h2>
                <Bar data={trafficData} />
            </section>

            <section>
                <h2>이벤트</h2>
                <p>유형: {deviceData.event.eventType}</p>
                <p>심각도: {deviceData.event.severity}</p>
                <p>메시지: {deviceData.event.message}</p>
            </section>
        </div>
    );
}

export default Dashboard;

