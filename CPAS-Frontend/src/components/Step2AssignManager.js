import React, { useState, useEffect } from 'react';

export default function Step2AssignManager({ onNext, onPrev }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Always fetch fresh data from backend (don't rely on localStorage for candidate data)
  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/interviews/get-candidates')
      .then(res => res.json())
      .then(result => {
        if (result.success && Array.isArray(result.data)) {
          const mapped = result.data.map((c) => ({
            id: c.job_id,
            candid: c.candidate_id,
            name: c.candidate_name,
            datetime: c.l1_interview_date || '', // Pre-fill if already scheduled
            manager: c.manager_assigned || '' // Pre-fill if already assigned
          }));
          setData(mapped);
        } else {
          setData([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching candidates:', err);
        setData([]);
        setLoading(false);
      });
  }, []);

  const handleDateTimeChange = (index, value) => {
    const updated = [...data];
    updated[index].datetime = value;
    setData(updated);
  };

  const handleManagerChange = (index, value) => {
    const updated = [...data];
    updated[index].manager = value;
    setData(updated);
  };

  const handleRejectCandidate = async (candidateId, index) => {
    if (window.confirm('Are you sure you want to reject this candidate?')) {
      try {
        const response = await fetch(`http://localhost:5000/interviews/candidate-reject?candidate_id=${candidateId}`, {
          method: 'DELETE'
        });
        const result = await response.json();
        
        if (result.success) {
          // Remove from local state
          const updated = data.filter((_, i) => i !== index);
          setData(updated);
          alert('Candidate rejected successfully');
        } else {
          alert('Failed to reject candidate: ' + result.message);
        }
      } catch (err) {
        alert('Error rejecting candidate: ' + err.message);
      }
    }
  };

  const handleScheduleInterview = async (candidateId, datetime, roundType = 'L1') => {
    try {
      // Convert datetime-local format (2025-01-15T14:30) to backend format (2025-01-15 14:30)
      const formattedDatetime = datetime.replace('T', ' ');
      
      const response = await fetch(`http://localhost:5000/interviews/interview-schedule?candidate_id=${candidateId}&interview_datetime=${formattedDatetime}&round_type=${roundType}`, {
        method: 'PATCH'
      });
      const result = await response.json();
      
      if (!result.success) {
        alert('Failed to schedule interview: ' + result.message);
        return false;
      }
      return true;
    } catch (err) {
      alert('Error scheduling interview: ' + err.message);
      return false;
    }
  };

  const handleAssignManager = async (candidateId, managerId) => {
    try {
      const response = await fetch('http://localhost:5000/interviews/managers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          candidate_id: candidateId,
          manager_id: managerId
        })
      });
      const result = await response.json();
      
      if (!result.success) {
        alert('Failed to assign manager: ' + result.message);
        return false;
      }
      return true;
    } catch (err) {
      alert('Error assigning manager: ' + err.message);
      return false;
    }
  };

  const handleNext = async () => {
    // Process all rows with datetime and manager assigned
    const updates = data.filter(row => row.datetime && row.manager);
    
    if (updates.length === 0) {
      alert('Please schedule interviews and assign managers before proceeding');
      return;
    }

    try {
      // Schedule interviews and assign managers
      for (const row of updates) {
        // Schedule interview
        const interviewScheduled = await handleScheduleInterview(row.candid, row.datetime);
        if (!interviewScheduled) return;

        // Assign manager
        const managerAssigned = await handleAssignManager(row.candid, row.manager);
        if (!managerAssigned) return;
      }

      alert('All updates saved successfully!');
      if (onNext) onNext();
    } catch (err) {
      alert('Error processing updates: ' + err.message);
    }
  };

  if (loading) {
    return <div>Loading candidates...</div>;
  }

  return (
    <div>
      <h3>Recruitment Step 2: Assign Manager</h3>
      {data.length === 0 ? (
        <div className="alert alert-info">
          No candidates found. Please go back to Step 1 and fetch data from sheet.
        </div>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Candid</th>
              <th>Job ID</th>
              <th>Candidate Name</th>
              <th>Interview Date & Time</th>
              <th>Assign Manager</th>
              <th>Reject Candidate</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.candid}>
                <td>{row.candid}</td>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>
                  <input
                    type="datetime-local"
                    className="form-control"
                    value={row.datetime}
                    onChange={(e) => handleDateTimeChange(index, e.target.value)}
                  />
                  {row.datetime && (
                    <div className="mt-2 text-primary">
                      <small>Selected: {new Date(row.datetime).toLocaleString()}</small>
                    </div>
                  )}
                </td>
                <td>
                  <select
                    className="form-select"
                    value={row.manager}
                    onChange={(e) => handleManagerChange(index, e.target.value)}
                  >
                    <option value="">Select Manager</option>
                    <option value="manager_raj">Raj Kumar</option>
                    <option value="manager_sneha">Sneha Kapoor</option>
                    <option value="manager_arjun">Arjun Verma</option>
                  </select>
                  {row.manager && (
                    <div className="mt-2 text-success">
                      <small>Selected: {row.manager.replace('manager_', '').replace(/_/g, ' ')}</small>
                    </div>
                  )}
                </td>
                <td>
                  <button 
                    className="btn btn-outline-danger"
                    onClick={() => handleRejectCandidate(row.candid, index)}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-secondary" onClick={onPrev}>
          Previous
        </button>
        <button 
          className="btn btn-success" 
          onClick={handleNext}
          disabled={data.length === 0}
        >
          Next Page
        </button>
      </div>
    </div>
  );
}