import React, { useState, useEffect } from 'react';

export default function Step2AssignManager({ onNext, onPrev }) {
  const [data, setData] = useState([]);

  // Load from localStorage if available, else fetch from backend
  useEffect(() => {
    const saved = localStorage.getItem('step2_assign_manager');
    if (saved) {
      setData(JSON.parse(saved));
    } else {
      fetch('http://localhost:5000/interviews/get-candidates')
        .then(res => res.json())
        .then(result => {
          if (result.success && Array.isArray(result.data)) {
            const mapped = result.data.map((c, idx) => ({
              id: c.job_id,
              candid: c.candidate_id,
              name: c.candidate_name,
              datetime: '',
              manager: ''
            }));
            setData(mapped);
            localStorage.setItem('step2_assign_manager', JSON.stringify(mapped));
          } else {
            setData([]);
          }
        })
        .catch(() => setData([]));
    }
  }, []);

  const handleDateTimeChange = (index, value) => {
    const updated = [...data];
    updated[index].datetime = value;
    setData(updated);
    localStorage.setItem('step2_assign_manager', JSON.stringify(updated));
  };

  const handleManagerChange = (index, value) => {
    const updated = [...data];
    updated[index].manager = value;
    setData(updated);
    localStorage.setItem('step2_assign_manager', JSON.stringify(updated));
  };

  // Save to backend on Next Page
  const handleNext = async () => {
    // Save to DB for all rows with datetime and manager selected
    const updates = data.filter(row => row.datetime && row.manager);
    if (updates.length > 0) {
      await Promise.all(updates.map(row =>
        fetch('http://localhost:5000/interviews/update-interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            candidate_id: row.candid,
            interview_datetime: row.datetime,
            manager: row.manager
          })
        })
      ));
    }
    localStorage.setItem('step2_assign_manager', JSON.stringify(data));
    if (onNext) onNext();
  };

  return (
    <div>
      <h3>Recruitment Step 2: Assign Manager</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Candid</th>
            <th>Candidate Name</th>
            <th>Interview Date & Time</th>
            <th>Assign Manager</th>
            <th>Reject Candidate</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.candid}>
              <td>{row.id}</td>
              <td>{row.candid}</td>
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
                    Selected: {new Date(row.datetime).toLocaleString()}
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
                    Selected: {row.manager.replace('manager_', '').replace(/_/g, ' ')}
                  </div>
                )}
              </td>
              <td>
                <button className="btn btn-outline-danger">Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-secondary" onClick={onPrev}>
          Previous
        </button>
        <button className="btn btn-success" onClick={onNext}>
          Next Page
        </button>
      </div>
    </div>
  );
}
