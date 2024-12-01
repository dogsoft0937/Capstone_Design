import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import "../css/MainPage.css";

function MainPage() {
    const [devices, setDevices] = useState([]);
    const [ports, setPorts] = useState([]);
    const [trafficStats, setTrafficStats] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(null); // 현재 활성화된 목록을 관리하는 상태

    const fetchData = (type) => {
        if (activeTab === type) {
            // 이미 활성화된 탭을 다시 누르면 비활성화
            setActiveTab(null);
            return;
        }
        setLoading(true);
        let apiUrl = "";

        switch (type) {
            case "devices":
                apiUrl = "http://127.0.0.1:2306/api/devices";
                break;
            case "ports":
                apiUrl = "http://127.0.0.1:2306/api/ports";
                break;
            case "trafficStats":
                apiUrl = "http://127.0.0.1:2306/api/trafficStats";
                break;
            case "events":
                apiUrl = "http://127.0.0.1:2306/api/events";
                break;
            default:
                return;
        }

        axios
            .get(apiUrl)
            .then((response) => {
                switch (type) {
                    case "devices":
                        setDevices(response.data);
                        break;
                    case "ports":
                        setPorts(response.data);
                        break;
                    case "trafficStats":
                        setTrafficStats(response.data);
                        break;
                    case "events":
                        setEvents(response.data);
                        break;
                    default:
                        break;
                }
                setActiveTab(type);
                setLoading(false);
            })
            .catch((error) => {
                console.error(`Error fetching ${type} data:`, error);
                setLoading(false);
            });
    };

    const renderList = () => {
        switch (activeTab) {
            case "devices":
                return devices.map((device) => (
                    <div key={device.id} className="device-card">
                        <Link to={`/devices/${device.id}`} className="device-link">
                            <h2 className="device-name">{device.deviceName}</h2>
                            <h2 className={`status ${device.status.toLowerCase()}`}>{device.status}</h2>
                        </Link>
                    </div>
                ));
            case "ports":
                return ports.map((port) => (
                    <div key={port.id} className="port-card">
                        <Link to={`/ports/${port.id}`} className="device-link">
                            <h2 className="device-name">{port.id}</h2>
                            <h2 className={`status ${port.portStatus.toLowerCase()}`}>{port.portStatus}</h2>
                        </Link>
                    </div>
                ));
            case "trafficStats":
                return trafficStats.map((stat, index) => (
                    <div key={index} className="traffic-card">
                        <Link to={`/trafficStats/${stat.id}`} className="device-link">
                            <h2 className="device-name">{stat.id} </h2>
                        </Link>
                    </div>
                ));
            case "events":
                return events.map((event) => (
                    <div key={event.id} className="event-card">
                        <Link to={`/events/${event.id}`} className="device-link">
                            <h2 className="device-name">{event.id}</h2>
                        </Link>
                    </div>
                ));
            default:
                return;
        }
    };

    return (
        <div className="main-container">

            {/* 상단 버튼 */}
            <div className="button-group">
                <button onClick={() => fetchData("devices")}>장치 목록</button>
                <button onClick={() => fetchData("ports")}>포트 목록</button>
                <button onClick={() => fetchData("trafficStats")}>트래픽 상태</button>
                <button onClick={() => fetchData("events")}>이벤트 목록</button>
            </div>

            {/* 데이터 로딩 상태 */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="data-list">{renderList()}</div>
            )}

            <Dashboard />
        </div>
    );
}

export default MainPage;

