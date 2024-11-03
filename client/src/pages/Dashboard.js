import React, { useEffect, useState } from 'react';
import '../css/Dashboard.css';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Chart.js 스케일과 요소 등록
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
       

        axios.get('http://172.30.1.38:2306/api/devices')
            .then((response) => {
                console.log("초기 데이터:", response.data);
            })
            .catch((error) => {
                console.error("API 요청 오류:", error);
            });

        
    }, []);

    if (!data) return <p>데이터 로딩 중...</p>;

    // 트래픽 데이터를 위한 차트 구성
    const trafficData = {
        labels: ['Inbound', 'Outbound'],
        datasets: [
            {
                label: 'Traffic (MB)',
                data: [data.trafficStats.inboundTraffic, data.trafficStats.outboundTraffic],
                backgroundColor: ['#42a5f5', '#66bb6a']
            }
        ]
    };

    return (
        <div className="dashboard">
            <h1>실시간 대시보드</h1>

            {/* 장치 정보 */}
            <section>
                <h2>장치 정보</h2>
                <p>이름: {data.deviceInfo.deviceName}</p>
                <p>IP: {data.deviceInfo.deviceIP}</p>
                <p>상태: {data.deviceInfo.status}</p>
                <p>마지막 확인 시간: {new Date(data.deviceInfo.lastChecked).toLocaleString()}</p>
            </section>

            {/* 포트 상태 */}
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
                        {data.portInfo.map((port, index) => (
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

            {/* 트래픽 통계 */}
            <section>
                <h2>트래픽 통계</h2>
                <Bar data={trafficData} />
            </section>

            {/* 이벤트 */}
            <section>
                <h2>이벤트</h2>
                <p>유형: {data.event.eventType}</p>
                <p>심각도: {data.event.severity}</p>
                <p>메시지: {data.event.message}</p>
            </section>
        </div>
    );
}

export default Dashboard;


