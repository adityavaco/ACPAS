import React from 'react';

export default function Step1Upload({ onNext, onReload }) {
  // Function to handle fetch-from-sheet POST request
  const handleFetchFromSheet = async () => {
    try {
      const response = await fetch('http://localhost:5000/interviews/fetch-data-from-sheet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      console.log('Response from server:', data);
      if (data.success) {
        alert(data.message || 'Data fetched and inserted successfully!');
        if (onReload) onReload();
        if (onNext) onNext();
      } else {
        alert('Failed: ' + (data.message || 'Unknown error'));
        if (onReload) onReload(); // Still reload to reflect any changes
      }
    } catch (err) {
      alert('Error: ' + err.message);
      if (onReload) onReload();
    }
  };

  // Function to handle generate-meeting-link POST request
  const handleGenerateMeetLink = async () => {
    const candidateId = prompt('Enter Candidate ID to generate Meet Link:');
    if (!candidateId) return;
    try {
      const response = await fetch('http://localhost:5000/interviews/generate-meeting-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidate_id: candidateId })
      });
      const data = await response.json();
      if (data.success && data.meeting_url) {
        alert('Meet Link generated: ' + data.meeting_url);
      } else {
        alert('Failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <button
        className="btn btn-sm btn-primary"
        id="fetch-from-sheet"
        onClick={handleFetchFromSheet}
      >
        Click to Fetch from Sheet
      </button>
      <button className="btn btn-sm btn-secondary">Add Job ID</button>
      <button className="btn btn-sm btn-info">Check & Fetch Salary</button>
      <button className="btn btn-sm btn-warning" onClick={handleGenerateMeetLink}>
        Generate Meet Link
      </button>
    </div>
  );
}
