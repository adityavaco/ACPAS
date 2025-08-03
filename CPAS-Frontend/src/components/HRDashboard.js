// components/HRDashboard.js
import React, { useState } from 'react';
import Step1Upload from './Step1Upload';
import Step2AssignManager from './Step2AssignManager';
import Step3Interview from './Step3Interview';
import Step4OfferBGV from './Step4OfferBGV';

export default function HRDashboard() {
  const [showRecruitmentOptions, setShowRecruitmentOptions] = useState(false);
  // Show Step2AssignManager by default
  return (
    <div>
      <div className="accordion mb-4" id="recruitmentAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header" id="headingRecruitment">
            <button
              className="accordion-button"
              type="button"
              onClick={() => setShowRecruitmentOptions(!showRecruitmentOptions)}
              aria-expanded={showRecruitmentOptions}
              aria-controls="collapseRecruitment"
            >
              Recruitment Options
            </button>
          </h2>
          <div
            id="collapseRecruitment"
            className={`accordion-collapse collapse${showRecruitmentOptions ? ' show' : ''}`}
            aria-labelledby="headingRecruitment"
            data-bs-parent="#recruitmentAccordion"
          >
            <div className="accordion-body">
              <Step1Upload />
            </div>
          </div>
        </div>
      </div>
      <Step2AssignManager />
    </div>
  );
}
