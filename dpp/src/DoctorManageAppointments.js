import React, { useState, useEffect } from 'react';
import './App.css';

const DoctorManageAppointments = ({ userAppointments, cancelAppointment, loggedInUser, completeAppointment }) => {
  const [bookedAppointments, setBookedAppointments] = useState([
    { id: 1, doctor: 'Dr. Smith', time: '10:00 AM', reason: 'Checkup', notes: 'Annual physical', reservedBy: 'Billy Joel' },
    { id: 2, doctor: 'Dr. Jones', time: '11:00 AM', reason: 'Consultation', notes: 'Discuss test results' }
  ]);
  const [expandedAppointmentId, setExpandedAppointmentId] = useState(null);
  const [notes, setNotes] = useState('');

              //this is for not having hardcoded values
  // useEffect(() => {
  //   setBookedAppointments(userAppointments.filter(
  //     (appointment) => appointment.reservedBy === loggedInUser.name
  //   ));
  // }, [userAppointments, loggedInUser.name]);

  useEffect(() => {
    // Set booked appointments from the props if they exist
    if (userAppointments && userAppointments.length > 0) {
      setBookedAppointments(userAppointments);
    }
  }, [userAppointments]);

  const handleCancelAppointment = (appointment) => {
    cancelAppointment(appointment); // Call the cancelAppointment function passed via props
    setBookedAppointments(bookedAppointments.filter((a) => a.id !== appointment.id)); // Remove from the user's booked appointments list
  };

  const handleCompleteAppointment = (appointment) => {
    completeAppointment(appointment); // Call the completeAppointment function passed via props
    setBookedAppointments(bookedAppointments.filter((a) => a.id !== appointment.id)); // Remove from the user's booked appointments list
    setNotes('');
  };

  const handleToggleExpand = (appointmentId) => {
    // Toggle expansion: if the same appointment is clicked again, collapse it
    setExpandedAppointmentId(expandedAppointmentId === appointmentId ? null : appointmentId);
  };

  return (
    <div>
      <h2>Your Booked Appointments</h2>
      <ul className="appointment-list">
      {bookedAppointments.length > 0 ? (
          bookedAppointments.map((appointment) => (
            <li key={appointment.id}>
              <div className="appointment-info" onClick={() => handleToggleExpand(appointment.id)}>
                {appointment.doctor} - {appointment.time} (Reserved by: {appointment.reservedBy})
              </div>
                <br />
                <label>
                  Notes:
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional notes"
                  />
                </label>
                <br />
              {/* Conditionally render medical details if the appointment is expanded */}
              {expandedAppointmentId === appointment.id && (
                <div className="medical-details">
                  <h4>Medical Details:</h4>
                  <p><strong>Reason:</strong> {appointment.reason}</p>
                  <p><strong>Doctor's Notes:</strong> {appointment.notes}</p>
                  {/* Add more medical details here as needed */}
                </div>
              )}
              <div>
                <button onClick={() => handleCompleteAppointment(appointment)} className="complete-button" style={{margin: 7}}>
                Complete
                </button>
                <button onClick={() => handleCancelAppointment(appointment)} className="cancel-button">
                  Cancel
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>You have no appointments.</p>
        )}
      </ul>
    </div>
  );
};

export default DoctorManageAppointments;
