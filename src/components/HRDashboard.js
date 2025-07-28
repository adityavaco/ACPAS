// components/HRDashboard.js
import React, { useState } from 'react';
import Step1Upload from './Step1Upload';
import Step2AssignManager from './Step2AssignManager';
import Step3Interview from './Step3Interview';
import Step4OfferBGV from './Step4OfferBGV';

export default function HRDashboard() {
  const [step, setStep] = useState(1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1Upload onNext={() => setStep(2)} />;
      case 2:
        return (
          <Step2AssignManager
            onNext={() => setStep(3)}
            onPrev={() => setStep(1)}
          />
        );
      case 3:
        return (
          <Step3Interview
            onNext={() => setStep(4)}
            onPrev={() => setStep(2)}
          />
        );
      case 4:
        return <Step4OfferBGV onPrev={() => setStep(3)} />;
      default:
        return null;
    }
  };

  return <div>{renderStep()}</div>;
}
