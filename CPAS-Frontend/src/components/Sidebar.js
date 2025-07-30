// components/Sidebar.js
// components/Sidebar.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `nav-link text-white ${location.pathname === path ? 'fw-bold bg-secondary rounded' : ''}`;

  return (
    <div className="bg-dark text-white p-3" style={{ minHeight: '100vh', width: '250px' }}>
      <h5 className="mb-4">HR Panel</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2">
          <Link to="/recruitment" className={linkClass('/recruitment')}>Recruitment</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/onboarding" className={linkClass('/onboarding')}>Onboarding</Link>
        </li>
        <li className="nav-item mb-2">
          <Link to="/offboarding" className={linkClass('/offboarding')}>Offboarding</Link>
        </li>
      </ul>
    </div>
  );
}
