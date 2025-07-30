import React, { useState } from 'react';

export default function Step4OfferBGV({ onPrev }) {
  const [status, setStatus] = useState({
    offer: null,
    bgv: null,
    loi: null,
    additional: null,
  });

  const handleSelection = (field, value) => {
    setStatus(prev => ({ ...prev, [field]: value }));
  };

  const getBgColor = (field) => {
    if (status[field] === 'right') return '#d4edda'; // green
    if (status[field] === 'cross') return '#f8d7da'; // red
    return 'transparent'; // default
  };

  const renderButtons = (field) => {
    if (status[field]) return null; // already selected
    return (
      <>
        <button className="btn btn-sm btn-outline-success me-1" onClick={() => handleSelection(field, 'right')}>
          ✅
        </button>
        <button className="btn btn-sm btn-outline-danger" onClick={() => handleSelection(field, 'cross')}>
          ❌
        </button>
      </>
    );
  };

  return (
    <div>
      <h3>Recruitment Step 4: HR Final Steps</h3>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Candidate</th>
            <th>Offer Letter</th>
            <th>BGV</th>
            <th>Letter of Intent</th>
            <th>Additional Stages</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>CAN003 - Alex Roy</td>
            <td style={{ backgroundColor: getBgColor('offer') }}>
              {status.offer ? (
                <input type="checkbox" checked disabled />
              ) : (
                renderButtons('offer')
              )}
            </td>
            <td style={{ backgroundColor: getBgColor('bgv') }}>
              {status.bgv ? (
                <input type="checkbox" checked disabled />
              ) : (
                renderButtons('bgv')
              )}
            </td>
            <td style={{ backgroundColor: getBgColor('loi') }}>
              {status.loi ? (
                <input type="checkbox" checked disabled />
              ) : (
                renderButtons('loi')
              )}
            </td>
            <td style={{ backgroundColor: getBgColor('additional') }}>
              {status.additional ? (
                <input type="checkbox" checked disabled />
              ) : (
                renderButtons('additional')
              )}
            </td>
            <td>
              <button className="btn btn-danger btn-sm m-1">Reject Candidate</button>
              <button className="btn btn-success btn-sm m-1">Complete Recruitment</button>
            </td>
          </tr>
        </tbody>
      </table>
      <button className="btn btn-secondary" onClick={onPrev}>Previous</button>
    </div>
  );
}
