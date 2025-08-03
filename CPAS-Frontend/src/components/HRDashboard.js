// components/HRDashboard.js

import React, { useState } from 'react';
import Step1Upload from './Step1Upload';
import Step2AssignManager from './Step2AssignManager';
import Step3Interview from './Step3Interview';
import Step4OfferBGV from './Step4OfferBGV';

export default function HRDashboard() {
  const [showRecruitmentOptions, setShowRecruitmentOptions] = useState(false);

  const handleLogout = () => {
    // Add your logout logic here (e.g., clear tokens, redirect, etc.)
    alert('Logged out!');
  };

  return (
    <div>
      {/* Navbar removed for global placement */}

      {/* Enhanced Assign Manager Section - Full width */}
      <div className="mb-4 px-0">
        <div className="card shadow-sm border-0 rounded-0">
          <div className="card-header bg-secondary text-white fw-semibold fs-5">
            Assign Manager
          </div>
          <div className="card-body bg-light">
            <Step2AssignManager />
          </div>
        </div>
      </div>
    </div>
  );
}
