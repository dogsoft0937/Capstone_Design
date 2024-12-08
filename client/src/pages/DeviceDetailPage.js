/*
API: GET /api/devices/{id}
기능: 특정 장치의 상세 정보를 보여줍니다. 선택한 장치의 ID를 이용해 해당 장치의 세부 정보를 가져와 표시합니다.
예: 포트 상태, 트래픽 통계 등 해당 장치에 관한 세부 정보를 추가로 표시할 수도 있습니다.
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/DeviceDetailPage.css';

function DeviceDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [device, setDevice] = useState(null);
    const [ports, setPorts] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                setLoading(true);
                // 장치 정보 가져오기
                const deviceResponse = await axios.get(`http://localhost:2306/api/devices/${id}`);
                setDevice(deviceResponse.data);

                // 해당 장치의 포트 정보 가져오기
                const portsResponse = await axios.get(`http://localhost:2306/api/ports?deviceId=${id}`);
                setPorts(portsResponse.data);

                // 해당 장치의 이벤트 정보 가져오기
                const eventsResponse = await axios.get(`http://localhost:2306/api/events?deviceId=${id}`);
                setEvents(eventsResponse.data);

            } catch (error) {
                console.error('데이터 가져오기 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeviceData();
        
        // 5초마다 데이터 새로고침
        const interval = setInterval(fetchDeviceData, 5000);
        return () => clearInterval(interval);
    }, [id]);

    if (loading) return <div className="loading">데이터를 불러오는 중...</div>;
    if (!device) return <div className="error">장치를 찾을 수 없습니다.</div>;

    return (
        <div className="device-detail-container">
            <h1 className="device-detail-title">장치 상세 정보</h1>
            
            <div className="device-info">
                <h2>기본 정보</h2>
                <p><strong>ID:</strong> {device.id}</p>
                <p><strong>이름:</strong> {device.deviceName}</p>
                <p><strong>IP 주소:</strong> {device.deviceIP}</p>
                <p>
                    <strong>상태:</strong> 
                    <span className={`status ${device.status.toLowerCase()}`}>
                        {device.status}
                    </span>
                </p>
                <p><strong>마지막 확인:</strong> {new Date(device.lastChecked).toLocaleString()}</p>
            </div>

            <div className="ports-section">
                <h2>포트 정보</h2>
                <div className="ports-grid">
                    {ports.map(port => (
                        <div key={port.id} className="port-card">
                            <h3>포트 {port.portNumber}</h3>
                            <p className={`port-status ${port.portStatus.toLowerCase()}`}>
                                {port.portStatus}
                            </p>
                            <p>오류 수: {port.errorCount}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="events-section">
                <h2>최근 이벤트</h2>
                <div className="events-list">
                    {events.map(event => (
                        <div key={event.id} className="event-card">
                            <p className={`event-severity ${event.severity.toLowerCase()}`}>
                                {event.severity}
                            </p>
                            <p className="event-type">{event.eventType}</p>
                            <p className="event-message">{event.message}</p>
                            <p className="event-time">
                                {new Date(event.timestamp).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            <button className="back-button" onClick={() => navigate('/')}>
                뒤로가기
            </button>
        </div>
    );
}

export default DeviceDetailPage;

