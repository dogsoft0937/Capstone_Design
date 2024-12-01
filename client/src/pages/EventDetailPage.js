/*
API: GET /api/events/{id}
기능: 특정 이벤트의 세부 정보를 표시합니다. 이벤트의 유형, 심각도, 메시지 등을 자세히 보여줍니다.
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EventDetailPage.css'; // CSS 파일 추가

function EventDetailPage() {
    const { id } = useParams(); // URL에서 이벤트 ID 가져오기
    const navigate = useNavigate(); // 뒤로가기 구현
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // API 호출하여 특정 이벤트 정보 가져오기
        axios.get(`http://localhost:2306/api/events/${id}`)
            .then(response => {
                setEvent(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching event data:', error);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <p>Loading...</p>; // 데이터 로딩 중 표시

    if (!event) return <p>No event data found</p>; // 데이터가 없을 경우

    return (
        <div className="event-detail-container">
            <h1 className="event-detail-title">Event Detail</h1>
            <div className="event-info">
                <p><strong>Event ID:</strong> {event.id}</p>
                <p><strong>Type:</strong> {event.eventType}</p>
                <p><strong>Severity:</strong> 
                    <span className={`severity ${event.severity.toLowerCase()}`}>
                        {event.severity}
                    </span>
                </p>
                <p><strong>Message:</strong> {event.message}</p>
                <p><strong>Timestamp:</strong> {new Date(event.timestamp).toLocaleString()}</p>
            </div>
            <button className="back-button" onClick={() => navigate('/')}>
                뒤로가기
            </button>
        </div>
    );
}

export default EventDetailPage;
