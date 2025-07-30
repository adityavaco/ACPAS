import React, { useState } from 'react';
import './StarRating.css'; // optional for better star style

export default function Step3Interview({ onNext,onPrev }) {
  const [popup, setPopup] = useState(null);
  const [selection, setSelection] = useState("");
  const [statusColor, setStatusColor] = useState("");


  const [feedbacks, setFeedbacks] = useState({});
  const [jdRatings, setJdRatings] = useState({
    experience: 0,
    skillset: 0,
    communication: 0,
    interview: 0,
    aptitude: 0,
    decision: null
  });

  const openPopup = (stage) => {
    setPopup(stage);
  };

  const closePopup = () => {
    setPopup(null);
    setJdRatings({
      experience: 0,
      skillset: 0,
      communication: 0,
      interview: 0,
      aptitude: 0,
      decision: null
    });
  };

  const handleFeedbackChange = (e, stage) => {
    setFeedbacks({
      ...feedbacks,
      [stage]: {
        ...feedbacks[stage],
        feedback: e.target.value
      }
    });
  };

  const handleSelectionChange = (e, stage) => {
    setFeedbacks({
      ...feedbacks,
      [stage]: {
        ...feedbacks[stage],
        selection: e.target.value
      }
    });
  };

  /*const handleSubmit = () => {
    closePopup();
  };*/

  const handleSubmit = (stage) => {
  if (stage !== "JD") {
    if (selection === "Selected") {
      setStatusColor("green");
    } else {
      setStatusColor("red");
    }
    closePopup();
  }
}


  const handleStarRating = (criteria, value) => {
    setJdRatings(prev => ({
      ...prev,
      [criteria]: value
    }));
  };

  const calculateAverage = () => {
    const total =
      jdRatings.experience +
      jdRatings.skillset +
      jdRatings.communication +
      jdRatings.interview +
      jdRatings.aptitude;
    return (total / 5).toFixed(2);
  };

  const getColorClass = (stage) => {
    if (!feedbacks[stage]) return '';
    const selected = feedbacks[stage].selection;
    return selected === 'Selected' ? 'btn-success' : selected === 'Not Selected' ? 'btn-danger' : '';
  };

  const getRowColor = () => {
    return jdRatings.decision === 'Selected'
      ? 'table-success'
      : jdRatings.decision === 'Rejected'
      ? 'table-danger'
      : '';
  };

  const renderStars = (criteria) => {
    const value = jdRatings[criteria];
    return (
      <div>
        {[1, 2, 3, 4, 5].map(num => (
          <span
            key={num}
            className={`star ${num <= value ? 'filled' : ''}`}
            onClick={() => handleStarRating(criteria, num)}
          >★</span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h3>Recruitment Step 3: Interview</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Candid</th>
            <th>Candidate Name</th>
            <th>Interview Date & Time</th>
            <th>GMeet Link</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className={getRowColor()}>
            <td>CAN002</td>
            <td>Jane Smith</td>
            <td>2025-07-25, 10:00 AM</td>
            <td>
              <button
                className="btn btn-outline-success"
                onClick={() => window.open('https://meet.google.com/dummy-link', '_blank')}
              >
                Generate Link
              </button>
            </td>
            <td>
              {['L1', 'L2', 'HR', 'JD'].map(stage => (
                <button
                  className={`btn btn-sm m-1 ${getColorClass(stage)}`}
                  key={stage}
                  onClick={() => openPopup(stage)}
                >
                  {stage}
                </button>
              ))}
            </td>
          </tr>
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

      {popup && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{popup === 'JD' ? 'JD Evaluation' : `${popup} Feedback`}</h5>
                <button className="btn-close" onClick={closePopup}></button>
              </div>
              <div className="modal-body">
                {popup === 'JD' ? (
                  <div>
                    <div className="mb-3">
                      <label>Relevant Years of Experience</label>
                      {renderStars('experience')}
                    </div>
                    <div className="mb-3">
                      <label>Techstack / Skillset</label>
                      {renderStars('skillset')}
                    </div>
                    <div className="mb-3">
                      <label>Communication Skills</label>
                      {renderStars('communication')}
                    </div>
                    <div className="mb-3">
                      <label>Interview</label>
                      {renderStars('interview')}
                    </div>
                    <div className="mb-3">
                      <label>Aptitude</label>
                      {renderStars('aptitude')}
                    </div>
                    <div className="mb-3">
                      <strong>Average Score: {calculateAverage()} / 5</strong>
                    </div>
                    <div className="mb-3">
                      <label>Final Decision:</label>
                      <select
                        className="form-select"
                        value={jdRatings.decision || ''}
                        onChange={(e) =>
                          setJdRatings({ ...jdRatings, decision: e.target.value })
                        }
                      >
                        <option value="">Select</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <textarea
                      className="form-control mb-2"
                      placeholder={`${popup} feedback`}
                      value={feedbacks[popup]?.feedback || ''}
                      onChange={(e) => handleFeedbackChange(e, popup)}
                    />
                    <label className="form-label">Candidate Decision</label>
                    <select
                      className="form-select"
                      value={feedbacks[popup]?.selection || ''}
                      onChange={(e) => handleSelectionChange(e, popup)}
                    >
                      <option value="">Select</option>
                      <option value="Selected">Selected</option>
                      <option value="Not Selected">Not Selected</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                <button className="btn btn-secondary" onClick={closePopup}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
