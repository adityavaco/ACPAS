import React, { useState } from 'react';

export default function Step2AssignManager({ onNext, onPrev }) {
  const [data, setData] = useState([
    { id: 101, candid: 'CAN001', name: 'John Doe', datetime: '', manager: '' },
    { id: 102, candid: 'CAN002', name: 'Priya Singh', datetime: '', manager: '' },
    { id: 103, candid: 'CAN003', name: 'Alex Roy', datetime: '', manager: '' },
    { id: 104, candid: 'CAN004', name: 'Sneha Das', datetime: '', manager: '' },
    { id: 105, candid: 'CAN005', name: 'Karan Mehra', datetime: '', manager: '' },
  ]);

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
