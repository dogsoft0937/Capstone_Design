import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/TrafficStatsDetailPage.css';

function TrafficStatsDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [traffic, setTraffic] = useState(null);
    const [device, setDevice] = useState(null);
    const [port, setPort] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrafficData = async () => {
            try {
                setLoading(true);
                // 트래픽 정보 가져오기
                const trafficResponse = await axios.get(`http://localhost:2306/api/trafficStats/${id}`);
                setTraffic(trafficResponse.data);

                // 연관된 장치 정보 가져오기
                if (trafficResponse.data.deviceId) {
                    const deviceResponse = await axios.get(
                        `http://localhost:2306/api/devices/${trafficResponse.data.deviceId}`
                    );
                    setDevice(deviceResponse.data);
                }

                // 연관된 포트 정보 가져오기
                if (trafficResponse.data.portId) {
                    const portResponse = await axios.get(
                        `http://localhost:2306/api/ports/${trafficResponse.data.portId}`
                    );
                    setPort(portResponse.data);
                }

            } catch (error) {
                console.error('데이터 가져오기 오류:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrafficData();
        
        // 5초마다 데이터 새로고침
        const interval = setInterval(fetchTrafficData, 5000);
        return () => clearInterval(interval);
    }, [id]);

    // BigInt를 읽기 쉬운 형식으로 변환하는 함수
    const formatTrafficValue = (value) => {
        if (!value) return "0";
        
        // BigInt 문자열을 숫자로 변환
        const num = Number(value);
        
        // 단위 변환
        if (num >= 1000000000) {
            return `${(num / 1000000000).toFixed(2)} GB`;
        } else if (num >= 1000000) {
            return `${(num / 1000000).toFixed(2)} MB`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(2)} KB`;
        }
        return `${num} B`;
    };

    if (loading) return <div className="loading">데이터를 불러오는 중...</div>;
    if (!traffic) return <div className="error">트래픽 데이터를 찾을 수 없습니다.</div>;

    return (
        <div className="traffic-detail-container">
            <h1 className="traffic-detail-title">트래픽 상세 정보</h1>
            
            <div className="traffic-info">
                <div className="info-group">
                    <h2>트래픽 정보</h2>
                    <p><strong>측정 시간:</strong> {new Date(traffic.timestamp).toLocaleString()}</p>
                    <div className="traffic-stats">
                        <div className="traffic-stat inbound">
                            <h3>인바운드 트래픽</h3>
                            <p className="traffic-value">
                                {formatTrafficValue(traffic.inboundTraffic.toString())}
                            </p>
                        </div>
                        <div className="traffic-stat outbound">
                            <h3>아웃바운드 트래픽</h3>
                            <p className="traffic-value">
                                {formatTrafficValue(traffic.outboundTraffic.toString())}
                            </p>
                        </div>
                    </div>
                </div>

                {device && (
                    <div className="info-group">
                        <h2>장치 정보</h2>
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

                {port && (
                    <div className="info-group">
                        <h2>포트 정보</h2>
                        <p><strong>포트 번호:</strong> {port.portNumber}</p>
                        <p>
                            <strong>포트 상태:</strong>
                            <span className={`port-status ${port.portStatus.toLowerCase()}`}>
                                {port.portStatus}
                            </span>
                        </p>
                        <p><strong>오류 수:</strong> {port.errorCount}</p>
                        <button 
                            className="view-port-button"
                            onClick={() => navigate(`/ports/${port.id}`)}
                        >
                            포트 상세 보기
                        </button>
                    </div>
                )}

                <div className="traffic-actions">
                    <button className="back-button" onClick={() => navigate('/')}>
                        메인으로 돌아가기
                    </button>
                    <button 
                        className="refresh-button"
                        onClick={() => window.location.reload()}
                    >
                        새로고침
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TrafficStatsDetailPage;



