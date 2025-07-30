// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HRDashboard from './components/HRDashboard';
import Onboarding from './pages/Onboarding';
import Offboarding from './pages/Offboarding';

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Sidebar />
        <div className="p-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Navigate to="/recruitment" />} />
            <Route path="/recruitment" element={<HRDashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/offboarding" element={<Offboarding />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
