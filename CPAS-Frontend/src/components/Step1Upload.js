import React from 'react';

export default function Step1Upload({ onNext }) {
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
        alert('Data fetched and inserted successfully!');
        if (onNext) onNext();
      } else {
        alert('Failed: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div>
      <h3>Recruitment Step 1</h3>
      <div className="mb-3">
        <button
          className="btn btn-primary m-2"
          id="fetch-from-sheet"
          onClick={handleFetchFromSheet}
        >
          Click to Fetch from Sheet
        </button>
        <button className="btn btn-secondary m-2">Add Job ID</button>
        <button className="btn btn-info m-2">Check & Fetch Salary</button>
      </div>
    </div>
  );
}
