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
    const navigate = useNavigate(); // useNavigate 훅 추가
    const [device, setDevice] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:2306/api/devices/${id}`)
            .then(response => {
                setDevice(response.data);
            })
            .catch(error => {
                console.error('Error fetching device data:', error);
            });
    }, [id]);

    if (!device) return <p>Loading...</p>;

    return (
        <div className="device-detail-container">
            <h1 className="device-detail-title">Device Detail</h1>
            <div className="device-info">
                <p><strong>ID:</strong> {device.id}</p>
                <p><strong>Name:</strong> {device.deviceName}</p>
                <p><strong>IP:</strong> {device.deviceIP}</p>
                <p><strong>Status:</strong> 
                    <span className={`status ${device.status.toLowerCase()}`}>
                        {device.status}
                    </span>
                </p>
                <p><strong>Last Checked:</strong> {new Date(device.lastChecked).toLocaleString()}</p>
            </div>
            <button className="back-button" onClick={() => navigate('/')}>
                뒤로가기
            </button>
        </div>
    );
}

export default DeviceDetailPage;

