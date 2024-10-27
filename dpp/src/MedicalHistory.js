import React from 'react';
import './App.css';

const MedicalHistory = ({ medicalHistory }) => {
  return (
    <div>
      <h2>Your Medical History</h2>
      {medicalHistory.length > 0 ? (
        <ul className="medical-history-list">
          {medicalHistory.map((appointment) => (
            <li key={appointment.id}>
              <div className="appointment-info">
                Doctor: {appointment.doctor} <br />
                Time: {appointment.time} <br />
                Reason: {appointment.reason} <br />
                Notes: {appointment.notes} <br />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No medical history available.</p>
      )}
    </div>
  );
};

export default MedicalHistory;
