import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function Step2AssignManager({ onNext, onPrev, reloadKey }) {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Modal state
  const [modal, setModal] = useState({ show: false, rowIdx: null, round: null, mode: 'schedule' });
  const [modalDate, setModalDate] = useState('');
  const [modalMeetLink, setModalMeetLink] = useState('');

  // Always fetch fresh data from backend (don't rely on localStorage for candidate data)
  const fetchCandidates = () => {
    setLoading(true);
    fetch('http://localhost:5000/interviews/get-candidates')
      .then(res => res.json())
      .then(result => {
        if (result.success && Array.isArray(result.data)) {
          const mapped = result.data.map((c) => ({
            id: c.job_id,
            candid: c.candidate_id,
            name: c.candidate_name,
            l1_datetime: c.l1_interview_date || '',
            l1_status: (c.l1_status || 'pending').toLowerCase(),
            l2_datetime: c.l2_interview_date || '',
            l2_status: (c.l2_status || 'not_available').toLowerCase(),
            hr_datetime: c.hr_interview_date || '',
            hr_status: (c.hr_status || 'not_available').toLowerCase(),
            manager: c.manager_assigned || '',
            interview_link: c.interview_link || ''
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
  };

  useEffect(() => {
    fetchCandidates();
  }, [reloadKey]);

  // Modal open/close helpers
  const openModal = async (rowIdx, round, mode = 'schedule') => {
    setModal({ show: true, rowIdx, round, mode });
    if (mode === 'schedule') {
      setModalDate(data[rowIdx][`${round}_datetime`] || '');
    }
    // Always fetch the latest interview_link from backend for this candidate
    const candid = data[rowIdx]?.candid;
    if (candid) {
      try {
        const res = await fetch(`http://localhost:5000/interviews/get-candidates?candidate_id=${candid}`);
        const result = await res.json();
        if (result.success && Array.isArray(result.data) && result.data.length > 0) {
          setModalMeetLink(result.data[0].interview_link || '');
        } else {
          setModalMeetLink(data[rowIdx]?.interview_link || '');
        }
      } catch (e) {
        setModalMeetLink(data[rowIdx]?.interview_link || '');
      }
    } else {
      setModalMeetLink('');
    }
  };
  const closeModal = () => {
    setModal({ show: false, rowIdx: null, round: null, mode: 'schedule' });
    setModalMeetLink('');
  };


  // Manager assignment handler
  const handleManagerChange = async (index, value) => {
    const row = data[index];
    // Save to backend
    const response = await fetch(`http://localhost:5000/interviews/assign-manager?candidate_id=${row.candid}&manager=${value}`, { method: 'PATCH' });
    const result = await response.json();
    if (result.success) {
      // Update local state
      setData(prev => prev.map((r, i) => i === index ? { ...r, manager: value } : r));
    } else {
      alert('Failed to assign manager: ' + result.message);
    }
  };

  // Reject candidate handler
  const handleRejectCandidate = async (candid, index) => {
    if (!window.confirm('Are you sure you want to reject this candidate?')) return;
    const response = await fetch(`http://localhost:5000/interviews/candidate-reject?candidate_id=${candid}`, { method: 'DELETE' });
    const result = await response.json();
    if (result.success) {
      setData(prev => prev.filter((r, i) => i !== index));
    } else {
      alert('Failed to reject candidate: ' + result.message);
    }
  };

  // Helper for tab color
  const getTabClass = (status, datetime) => {
    if (!datetime) return 'btn-outline-secondary'; // default if not scheduled
    if (status === 'pending') return 'bg-warning text-dark';
    if (status === 'accepted') return 'bg-success text-white';
    if (status === 'rejected') return 'bg-danger text-white';
    return 'bg-secondary text-white';
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
              <th>Interview Status</th>
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
                  {/* Tabs for L1, L2, HR */}
                  <div className="d-flex gap-2 mb-2">
                    <button
                      className={`btn btn-sm ${getTabClass(row.l1_status, row.l1_datetime)}`}
                      onClick={() => openModal(index, 'l1', row.l1_datetime ? 'status' : 'schedule')}
                    >
                      L1
                    </button>
                    <button
                      className={`btn btn-sm ${getTabClass(row.l2_status, row.l2_datetime)}`}
                      disabled={row.l1_status !== 'accepted'}
                      onClick={row.l1_status === 'accepted' ? () => openModal(index, 'l2', row.l2_datetime ? 'status' : 'schedule') : undefined}
                    >
                      L2
                    </button>
                    <button
                      className={`btn btn-sm ${getTabClass(row.hr_status, row.hr_datetime)}`}
                      disabled={row.l2_status !== 'accepted'}
                      onClick={row.l2_status === 'accepted' ? () => openModal(index, 'hr', row.hr_datetime ? 'status' : 'schedule') : undefined}
                    >
                      HR
                    </button>
                  </div>
                  {/* Show scheduled date/time for each round */}
                  {row.l1_datetime && (
                    <div className="mb-1"><small>L1: {new Date(row.l1_datetime).toLocaleString()}</small></div>
                  )}
                  {row.l2_datetime && (
                    <div className="mb-1"><small>L2: {new Date(row.l2_datetime).toLocaleString()}</small></div>
                  )}
                  {row.hr_datetime && (
                    <div className="mb-1"><small>HR: {new Date(row.hr_datetime).toLocaleString()}</small></div>
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

      {/* Modal for scheduling/status for any round (L1, L2, HR) */}
      <Modal show={modal.show} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modal.round ? `${modal.round.toUpperCase()} Interview` : 'Interview'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label className="form-label">Select Date & Time</label>
            <input
              type="datetime-local"
              className="form-control mb-3"
              value={modalDate}
              onChange={e => setModalDate(e.target.value)}
            />
            {/* Generate Meet Link field and button side by side */}
            <div className="mb-3 d-flex align-items-center gap-2">
              <input
                type="text"
                className="form-control"
                style={{ flex: 1 }}
                value={modalMeetLink}
                readOnly
                placeholder="Meet link will appear here"
              />
              <Button
                variant="info"
                style={{ whiteSpace: 'nowrap' }}
                onClick={async () => {
                  const row = data[modal.rowIdx];
                  const response = await fetch('http://localhost:5000/interviews/generate-meeting-link', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ candidate_id: row.candid })
                  });
                  const result = await response.json();
                  if (result.success && result.meeting_url) {
                    setData(prev => prev.map((r, i) => i === modal.rowIdx ? { ...r, interview_link: result.meeting_url } : r));
                  } else {
                    alert('Failed to generate meet link: ' + result.message);
                  }
                }}
              >Generate Meet Link</Button>
            </div>
            {/* Action buttons row */}
            <div className="d-flex gap-2 mb-3">
              <Button
                variant="primary"
                onClick={async () => {
                  const row = data[modal.rowIdx];
                  const formattedDatetime = modalDate.replace('T', ' ');
                  const response = await fetch('http://localhost:5000/interviews/interview-schedule', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      candidate_id: row.candid,
                      interview_datetime: formattedDatetime,
                      round_type: modal.round ? modal.round.toUpperCase() : 'L1'
                    })
                  });
                  const result = await response.json();
                  if (result.success) {
                    fetchCandidates();
                    closeModal();
                  } else {
                    alert('Failed to schedule: ' + result.message);
                  }
                }}
                disabled={!modalDate}
              >
                Save
              </Button>
              <Button
                variant="secondary"
                onClick={async () => {
                  const row = data[modal.rowIdx];
                  const response = await fetch('http://localhost:5000/interviews/interview-schedule', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      candidate_id: row.candid,
                      interview_datetime: null,
                      round_type: modal.round ? modal.round.toUpperCase() : 'L1',
                      reset: true
                    })
                  });
                  const result = await response.json();
                  if (result.success) {
                    fetchCandidates();
                    setModalDate('');
                    setModalMeetLink('');
                    closeModal();
                  } else {
                    alert('Failed to reset: ' + result.message);
                  }
                }}
              >Reset</Button>
              <Button
                variant="success"
                onClick={async () => {
                  const row = data[modal.rowIdx];
                  const response = await fetch('http://localhost:5000/interviews/candidate-stage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      candidate_id: row.candid,
                      stage: modal.round ? modal.round.toUpperCase() : 'L1',
                      feedback: 'Accepted',
                      status: 'ACCEPTED'
                    })
                  });
                  const result = await response.json();
                  if (result.success) {
                    fetchCandidates();
                    closeModal();
                  } else {
                    alert('Failed to update status: ' + result.message);
                  }
                }}
                disabled={!data[modal.rowIdx]?.[`${modal.round}_datetime`]}
              >Accept</Button>
              <Button
                variant="danger"
                onClick={async () => {
                  const row = data[modal.rowIdx];
                  const response = await fetch('http://localhost:5000/interviews/candidate-stage', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      candidate_id: row.candid,
                      stage: modal.round ? modal.round.toUpperCase() : 'L1',
                      feedback: 'Rejected',
                      status: 'REJECTED'
                    })
                  });
                  const result = await response.json();
                  if (result.success) {
                    fetchCandidates();
                    closeModal();
                  } else {
                    alert('Failed to update status: ' + result.message);
                  }
                }}
                disabled={!data[modal.rowIdx]?.[`${modal.round}_datetime`]}
              >Reject</Button>
            </div>
            {/* Status and Interview Date */}
            <div className="mb-2">
              Status: <span className={
                data[modal.rowIdx]?.[`${modal.round}_status`] === 'accepted' ? 'text-success' :
                data[modal.rowIdx]?.[`${modal.round}_status`] === 'rejected' ? 'text-danger' : 'text-warning'
              }>
                {data[modal.rowIdx]?.[`${modal.round}_status`] ? data[modal.rowIdx][`${modal.round}_status`].toUpperCase() : 'NOT AVAILABLE'}
              </span>
            </div>
            <div className="mb-2">
              Interview Date: <b>{data[modal.rowIdx]?.[`${modal.round}_datetime`] ? new Date(data[modal.rowIdx][`${modal.round}_datetime`]).toLocaleString() : 'Not set'}</b>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className="d-flex justify-content-end mt-4">
        <Button variant="primary" onClick={() => {
          if (onNext) {
            onNext();
          } else {
            navigate('/step3interview');
          }
        }}>
          Next
        </Button>
      </div>
    </div>
  );
  // ...existing code...
}