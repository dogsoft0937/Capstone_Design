import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MainPage from './pages/MainPage';
import DeviceDetailPage from './pages/DeviceDetailPage';
import PortListPage from './pages/PortListPage';
import PortDetailPage from './pages/PortDetailPage';
import TrafficStatsPage from './pages/TrafficStatsPage';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';

function App() {
  return (
    <div className="App">
      <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/devices/:id" element={<DeviceDetailPage />} />
                <Route path="/ports" element={<PortListPage />} />
                <Route path="/ports/:id" element={<PortDetailPage />} />
                <Route path="/traffic-stats" element={<TrafficStatsPage />} />
                <Route path="/events" element={<EventListPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
            </Routes>
        </Router>
    </div>
  );
}

export default App;
