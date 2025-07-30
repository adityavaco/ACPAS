import React from 'react';

export default function Step1Upload({ onNext }) {
  return (
    <div>
      <h3>Recruitment Step 1</h3>
      <div className="mb-3">
        <button className="btn btn-primary m-2"onClick={onNext}>Click to Fetch from Sheet</button>
        <button className="btn btn-secondary m-2">Add Job ID</button>
        <button className="btn btn-info m-2">Check & Fetch Salary</button>
      </div>
    </div>
  );
}
