import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/TrafficStatsDetailPage.css';

function TrafficStatsDetailPage() {
    const { id } = useParams(); // URL 파라미터에서 트래픽 ID 가져오기
    const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
    const [traffic, setTraffic] = useState(null); // 트래픽 데이터를 저장할 상태

    useEffect(() => {
        // API 요청으로 특정 트래픽 데이터 가져오기
        axios.get(`http://localhost:2306/api/trafficStats/${id}`)
            .then(response => {
                setTraffic(response.data);
            })
            .catch(error => {
                console.error('Error fetching traffic data:', error);
            });
    }, [id]);

    if (!traffic) return <p>Loading...</p>; // 데이터 로딩 중 표시

    return (
        <div className="traffic-detail-container">
            <h1 className="traffic-detail-title">Traffic Detail</h1>
            <div className="traffic-info">
                <p><strong>ID:</strong> {traffic.id}</p>
                <p><strong>Timestamp:</strong> {new Date(traffic.timestamp).toLocaleString()}</p>
                <p><strong>Inbound Traffic:</strong> {traffic.inboundTraffic}</p>
                <p><strong>Outbound Traffic:</strong> {traffic.outboundTraffic}</p>
                <p><strong>Device ID:</strong> {traffic.deviceId}</p>
            </div>
            <button className="back-button" onClick={() => navigate('/')}>
                뒤로가기
            </button>
        </div>
    );
}

export default TrafficStatsDetailPage;



