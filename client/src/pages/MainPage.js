import React, { useState } from "react";
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
    const [activeTab, setActiveTab] = useState("dashboard");

    const fetchData = (type) => {
        if (activeTab === type) {
            return;
        }
        setLoading(true);
        let apiUrl = "";

        switch (type) {
            case "devices":
                apiUrl = "http://localhost:2306/api/devices";
                break;
            case "ports":
                apiUrl = "http://localhost:2306/api/ports";
                break;
            case "trafficStats":
                apiUrl = "http://localhost:2306/api/trafficStats";
                break;
            case "events":
                apiUrl = "http://localhost:2306/api/events";
                break;
            default:
                setActiveTab(type);
                setLoading(false);
                return;
        }

        axios.get(apiUrl)
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

    const formatTrafficValue = (value) => {
        if (!value) return "0 B";
        
        const num = Number(value);
        
        if (num >= 1000000000) {
            return `${(num / 1000000000).toFixed(2)} GB`;
        } else if (num >= 1000000) {
            return `${(num / 1000000).toFixed(2)} MB`;
        } else if (num >= 1000) {
            return `${(num / 1000).toFixed(2)} KB`;
        }
        return `${num} B`;
    };

    const renderContent = () => {
        if (activeTab === "dashboard") {
            return <Dashboard />;
        }

        switch (activeTab) {
            case "devices":
                return devices.map((device) => (
                    <div key={device.id} className="device-card">
                        <Link to={`/devices/${device.id}`} className="device-link">
                            <h2 className="device-name">{device.deviceName}</h2>
                            <h2 className={`status ${device.status.toLowerCase()}`}>
                                {device.status}
                            </h2>
                            <p className="device-ip">{device.deviceIP}</p>
                            <p className="last-checked">
                                마지막 확인: {new Date(device.lastChecked).toLocaleString()}
                            </p>
                        </Link>
                    </div>
                ));
            case "ports":
                return ports.map((port) => (
                    <div key={port.id} className="port-card">
                        <Link to={`/ports/${port.id}`} className="device-link">
                            <h2 className="port-number">포트 {port.portNumber}</h2>
                            <h2 className={`status ${port.portStatus.toLowerCase()}`}>
                                {port.portStatus}
                            </h2>
                            <p className="error-count">오류 수: {port.errorCount}</p>
                        </Link>
                    </div>
                ));
            case "trafficStats":
                return trafficStats.map((stat) => (
                    <div key={stat.id} className="traffic-card">
                        <Link to={`/trafficStats/${stat.id}`} className="device-link">
                            <h2 className="traffic-title">트래픽 통계</h2>
                            <p>인바운드: {formatTrafficValue(stat.inboundTraffic.toString())}</p>
                            <p>아웃바운드: {formatTrafficValue(stat.outboundTraffic.toString())}</p>
                            <p className="timestamp">
                                {new Date(stat.timestamp).toLocaleString()}
                            </p>
                        </Link>
                    </div>
                ));
            case "events":
                return events.map((event) => (
                    <div key={event.id} className="event-card">
                        <Link to={`/events/${event.id}`} className="device-link">
                            <h2 className={`event-type ${event.severity.toLowerCase()}`}>
                                {event.eventType}
                            </h2>
                            <p className="severity">{event.severity}</p>
                            <p className="message">{event.message}</p>
                            <p className="timestamp">
                                {new Date(event.timestamp).toLocaleString()}
                            </p>
                        </Link>
                    </div>
                ));
            default:
                return null;
        }
    };

    return (
        <div className="main-container">
            <div className="button-group">
                <button 
                    onClick={() => setActiveTab("dashboard")}
                    className={activeTab === "dashboard" ? "active" : ""}
                >
                    대시보드
                </button>
                <button 
                    onClick={() => fetchData("devices")}
                    className={activeTab === "devices" ? "active" : ""}
                >
                    장치 목록
                </button>
                <button 
                    onClick={() => fetchData("ports")}
                    className={activeTab === "ports" ? "active" : ""}
                >
                    포트 목록
                </button>
                <button 
                    onClick={() => fetchData("trafficStats")}
                    className={activeTab === "trafficStats" ? "active" : ""}
                >
                    트래픽 상태
                </button>
                <button 
                    onClick={() => fetchData("events")}
                    className={activeTab === "events" ? "active" : ""}
                >
                    이벤트 목록
                </button>
            </div>

            {loading ? (
                <div className="loading">데이터를 불러오는 중...</div>
            ) : (
                <div className="content-area">
                    {renderContent()}
                </div>
            )}
        </div>
    );
}

export default MainPage;

