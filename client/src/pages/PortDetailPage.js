/*
API: GET /api/ports/{id}
기능: 특정 포트의 상세 정보를 보여줍니다. 선택한 포트의 ID를 이용해 해당 포트의 세부 정보를 가져와 표시합니다.
예: 트래픽 상태, 오류 개수 등 포트에 관한 세부 정보를 추가로 표시할 수 있습니다.
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/PortDetailPage.css';

function PortDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [port, setPort] = useState(null);
    const [device, setDevice] = useState(null);
    const [trafficStats, setTrafficStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortData = async () => {
            try {
                setLoading(true);
                // 포트 정보 가져오기
                const portResponse = await axios.get(`http://localhost:2306/api/ports/${id}`);
                setPort(portResponse.data);

                // 연관된 장치 정보 가져오기
                if (portResponse.data.deviceId) {
                    const deviceResponse = await axios.get(
                        `http://localhost:2306/api/devices/${portResponse.data.deviceId}`
                    );
                    setDevice(deviceResponse.data);
                }

                // 트래픽 통계 가져오기
                const trafficResponse = await axios.get(
                    `http://localhost:2306/api/trafficStats?portId=${id}`
                );
                setTrafficStats(trafficResponse.data);

            } catch (error) {
                console.error('데이터 가져오기 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPortData();
        
        // 5초마다 데이터 새로고침
        const interval = setInterval(fetchPortData, 5000);
        return () => clearInterval(interval);
    }, [id]);

    if (loading) return <div className="loading">데이터를 불러오는 중...</div>;
    if (!port) return <div className="error">포트를 찾을 수 없습니다.</div>;

    return (
        <div className="port-detail-container">
            <h1 className="port-detail-title">포트 상세 정보</h1>
            
            <div className="port-info">
                <div className="info-group">
                    <h2>기본 정보</h2>
                    <p><strong>포트 번호:</strong> {port.portNumber}</p>
                    <p>
                        <strong>상태:</strong> 
                        <span className={`status-badge ${port.portStatus.toLowerCase()}`}>
                            {port.portStatus}
                        </span>
                    </p>
                    <p><strong>오류 수:</strong> {port.errorCount}</p>
                </div>

                {device && (
                    <div className="info-group">
                        <h2>연결된 장치 정보</h2>
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

                {trafficStats.length > 0 && (
                    <div className="info-group">
                        <h2>트래픽 통계</h2>
                        <div className="traffic-stats">
                            {trafficStats.map((stat, index) => (
                                <div key={index} className="traffic-item">
                                    <p><strong>시간:</strong> {new Date(stat.timestamp).toLocaleString()}</p>
                                    <p><strong>인바운드:</strong> {stat.inboundTraffic}</p>
                                    <p><strong>아웃바운드:</strong> {stat.outboundTraffic}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="port-actions">
                    <button className="back-button" onClick={() => navigate('/')}>
                        메인으로 돌아가기
                    </button>
                    {port.portStatus === 'Down' && (
                        <button 
                            className="reset-button"
                            onClick={() => {
                                // 포트 리셋 로직 추가 가능
                                alert('포트 리셋이 요청되었습니다.');
                            }}
                        >
                            포트 리셋
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PortDetailPage;
