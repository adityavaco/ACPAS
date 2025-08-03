// components/Sidebar.js
// components/Sidebar.js

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Step1Upload from './Step1Upload';

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `nav-link text-white ${location.pathname === path ? 'fw-bold bg-secondary rounded' : ''}`;

  const [showRecruitmentDropdown, setShowRecruitmentDropdown] = useState(false);
  return (
    <div className="bg-dark text-white p-3" style={{ minHeight: '100vh', width: '250px' }}>
      <h5 className="mb-4">HR Panel</h5>
      <ul className="nav flex-column">
        <li className="nav-item mb-2 d-flex align-items-center">
          <Link
            to="/recruitment"
            className={linkClass('/recruitment')}
            style={{ flex: 1, cursor: 'pointer', textDecoration: 'none' }}
          >
            Recruitment
          </Link>
          <span
            style={{ cursor: 'pointer', userSelect: 'none' }}
            onClick={e => { e.stopPropagation(); setShowRecruitmentDropdown(prev => !prev); }}
          >
            {showRecruitmentDropdown ? '\u25B2' : '\u25BC'}
          </span>
        </li>
        {showRecruitmentDropdown && (
          <li className="nav-item mb-2" style={{ paddingLeft: 32 }}>
            <Step1Upload />
          </li>
        )}
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
