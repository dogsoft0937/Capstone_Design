/* 
API: GET /api/devices/
기능: 전체 장치의 목록을 표시합니다. 장치의 이름, IP, 상태 등의 간단한 정보만 나열합니다.
예: 장치를 클릭하면 해당 장치의 상세 페이지로 이동.
*/

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function MainPage() {
    const [devices, setDevices] = useState([]); // 장치 목록을 저장할 상태 변수
    const [loading, setLoading] = useState(true); // 로딩 상태를 관리

    useEffect(() => {
        // API 요청을 통해 장치 목록 가져오기
        axios.get('http://172.30.1.38:2306/api/devices')
            .then(response => {
                setDevices(response.data); // 가져온 데이터로 상태 업데이트
                setLoading(false); // 로딩 완료
            })
            .catch(error => {
                console.error('Error fetching device data:', error);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>; // 로딩 중일 때 표시할 내용

    return (
        <div>
            <h1>Device List Page</h1>
            <ul>
                {devices.map(device => (
                    <li key={device.id}>
                        {/* 장치 클릭 시 상세 페이지로 이동하도록 설정 */}
                        <Link to={`/devices/${device.id}`}>
                            {device.name} - {device.ip} - {device.status}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default MainPage;
