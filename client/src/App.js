import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import DeviceDetailPage from './pages/DeviceDetailPage';
import PortDetailPage from './pages/PortDetailPage';
import EventDetailPage from './pages/EventDetailPage';
import TrafficStatsDetailPage from './pages/TrafficStatsDetailPage';

function App() {
  return (
    <div className="App">
      <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/devices/:id" element={<DeviceDetailPage />} />                
                <Route path="/ports/:id" element={<PortDetailPage />} />
                <Route path="/trafficStats/:id" element={<TrafficStatsDetailPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
