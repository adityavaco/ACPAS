// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import HRDashboard from './components/HRDashboard';
import Onboarding from './pages/Onboarding';
import Offboarding from './pages/Offboarding';

function App() {
  const handleLogout = () => {
    // Add your logout logic here (e.g., clear tokens, redirect, etc.)
    alert('Logged out!');
  };

  return (
    <Router>
      {/* Global Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary" style={{borderRadius: 0}}>
        <span className="navbar-brand fw-bold ps-3">CPAS Dashboard</span>
        <button
          className="btn btn-outline-light ms-auto me-3"
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>
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
