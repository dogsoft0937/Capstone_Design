import React, { useEffect, useState } from 'react';
import '../css/Dashboard.css';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Chart.js 스케일과 요소 등록
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // 웹소켓 연결 설정
        const socket = new WebSocket('ws://127.0.0.1:8080'); // 실제 웹소켓 주소로 변경

        // 웹소켓 연결이 열렸을 때
        socket.onopen = () => {
            console.log("웹소켓 연결 성공");
            // 서버에 메시지 보내기 (필요한 경우)
            socket.send(JSON.stringify({ message: '클라이언트에서 보낸 메시지입니다.' }));
        };

        // 서버로부터 메시지를 받을 때
        socket.onmessage = (event) => {
            console.log("서버로부터 받은 메시지:", event.data);
            try {
                // 받은 메시지를 JSON으로 파싱
                const receivedData = JSON.parse(event.data);
                setData(receivedData); // 받은 데이터를 상태에 설정
            } catch (error) {
                console.error("데이터 파싱 오류:", error);
            }
        };

        // 연결이 종료되었을 때
        socket.onclose = (event) => {
            console.log("웹소켓 연결이 닫혔습니다:", event);
        };

        // 에러가 발생했을 때
        socket.onerror = (event) => {
            console.error("웹소켓 오류 발생:", event);
        };

        // 컴포넌트 언마운트 시 웹소켓 연결 종료
        return () => socket.close();
        
    }, []);

    if (!data || !data.deviceInfo) return <p>데이터 로딩 중...</p>;

    // 트래픽 데이터를 위한 차트 구성
    const trafficData = data && data.trafficStats ? {
        labels: ['Inbound', 'Outbound'],
        datasets: [
            {
                label: 'Traffic (MB)',
                data: [
                    parseInt(data.trafficStats.inboundTraffic.replace('MB', '')), // 'MB' 제거 후 숫자로 변환
                    parseInt(data.trafficStats.outboundTraffic.replace('MB', ''))
                ],
                backgroundColor: ['#42a5f5', '#66bb6a']
            }
        ]
    } : null;

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

