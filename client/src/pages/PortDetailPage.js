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
    const { id } = useParams(); // URL 파라미터에서 포트 ID 가져오기
    const navigate = useNavigate(); // 페이지 이동을 위한 훅
    const [port, setPort] = useState(null); // 포트 데이터를 저장할 상태

    useEffect(() => {
        // API 요청으로 특정 포트 데이터 가져오기
        axios.get(`http://localhost:2306/api/ports/${id}`)
            .then(response => {
                setPort(response.data);
            })
            .catch(error => {
                console.error('Error fetching port data:', error);
            });
    }, [id]);

    if (!port) return <p>Loading...</p>; // 데이터 로딩 중일 때 표시

    return (
        <div className="port-detail-container">
            <h1 className="port-detail-title">Port Detail</h1>
            <div className="port-info">
                <p><strong>ID:</strong> {port.id}</p>
                <p><strong>Port Number:</strong> {port.portNumber}</p>
                <p><strong>Status:</strong> 
                    <span className={`status ${port.portStatus.toLowerCase()}`}>
                        {port.portStatus}
                    </span>
                </p>
                <p><strong>Error Count:</strong> {port.errorCount}</p>
            </div>
            <button className="back-button" onClick={() => navigate('/')}>
                뒤로가기
            </button>
        </div>
    );
}

export default PortDetailPage;
