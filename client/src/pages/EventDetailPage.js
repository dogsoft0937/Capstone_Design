/*
API: GET /api/events/{id}
기능: 특정 이벤트의 세부 정보를 표시합니다. 이벤트의 유형, 심각도, 메시지 등을 자세히 보여줍니다.
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EventDetailPage.css';

function EventDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [device, setDevice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventData = async () => {
            try {
                setLoading(true);
                // 이벤트 정보 가져오기
                const eventResponse = await axios.get(`http://localhost:2306/api/events/${id}`);
                setEvent(eventResponse.data);

                // 연관된 장치 정보 가져오기
                if (eventResponse.data.deviceId) {
                    const deviceResponse = await axios.get(
                        `http://localhost:2306/api/devices/${eventResponse.data.deviceId}`
                    );
                    setDevice(deviceResponse.data);
                }
            } catch (error) {
                console.error('데이터 가져오기 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventData();
    }, [id]);

    if (loading) return <div className="loading">데이터를 불러오는 중...</div>;
    if (!event) return <div className="error">이벤트를 찾을 수 없습니다.</div>;

    const getSeverityClass = (severity) => {
        switch (severity.toLowerCase()) {
            case 'critical':
                return 'severity-critical';
            case 'warning':
                return 'severity-warning';
            case 'info':
                return 'severity-info';
            default:
                return '';
        }
    };

    return (
        <div className="event-detail-container">
            <h1 className="event-detail-title">이벤트 상세 정보</h1>
            
            <div className="event-info">
                <div className={`event-header ${getSeverityClass(event.severity)}`}>
                    <h2>{event.eventType}</h2>
                    <span className={`severity-badge ${event.severity.toLowerCase()}`}>
                        {event.severity}
                    </span>
                </div>

                <div className="event-body">
                    <div className="info-group">
                        <h3>기본 정보</h3>
                        <p><strong>이벤트 ID:</strong> {event.id}</p>
                        <p><strong>발생 시간:</strong> {new Date(event.timestamp).toLocaleString()}</p>
                        <p><strong>메시지:</strong> {event.message}</p>
                    </div>

                    {device && (
                        <div className="info-group">
                            <h3>관련 장치 정보</h3>
                            <p><strong>장치 이름:</strong> {device.deviceName}</p>
                            <p><strong>IP 주소:</strong> {device.deviceIP}</p>
                            <p>
                                <strong>장치 상태:</strong>
                                <span className={`device-status ${device.status.toLowerCase()}`}>
                                    {device.status}
                                </span>
                            </p>
                            <button 
                                className="view-device-button"
                                onClick={() => navigate(`/devices/${device.id}`)}
                            >
                                장치 상세 보기
                            </button>
                        </div>
                    )}
                </div>

                <div className="event-actions">
                    <button className="back-button" onClick={() => navigate('/')}>
                        메인으로 돌아가기
                    </button>
                    {device && (
                        <button 
                            className="acknowledge-button"
                            onClick={() => {
                                // 이벤트 확인 처리 로직 추가 가능
                                alert('이벤트가 확인되었습니다.');
                            }}
                        >
                            이벤트 확인
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EventDetailPage;
