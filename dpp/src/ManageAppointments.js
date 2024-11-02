import React, { useState, useEffect } from 'react';
import axios  from 'axios';
import './App.css';

const ManageAppointments = ({ cancelAppointment }) => {
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [expandedAppointmentId, setExpandedAppointmentId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/appointment/');
        console.log(response.data.results);

        setBookedAppointments(response.data.results || [])

        setSuccess(true);
        setError('');

      } catch (error) {
        setSuccess(false);
        setError('Invalid user. Please create an account.');
      }
    };
    fetchAppointments();
  }, []);

  const handleCancelAppointment = (appointment) => {
    cancelAppointment(appointment); // Call the cancelAppointment function passed via props
    setBookedAppointments(bookedAppointments.filter((a) => a.id !== appointment.id)); // Remove from the user's booked appointments list
  };

  const handleToggleExpand = (appointmentId) => {
    // Toggle expansion: if the same appointment is clicked again, collapse it
    setExpandedAppointmentId(expandedAppointmentId === appointmentId ? null : appointmentId);
  };

  return (
    <div>
      <h2>Your Booked Appointments</h2>
      {bookedAppointments.length > 0 ? (
        <ul className="appointment-list">
          {bookedAppointments.map((appointment) => (
          <li key={appointment.id} className="appointment-info" onClick={() => handleToggleExpand(appointment.id)}>
            Doctor Id: {appointment.doctor_id} 
            <br></br>Date: {appointment.appointment_date} 
            <br></br>Status: {appointment.status}
            <br></br>Patient Id: {appointment.patient_id}
            <button onClick={() => handleCancelAppointment(appointment)} className="cancel-button">Cancel</button>
          </li>
        ))}
        </ul>
      ) : (
        <p>No booked appointments.</p>
      )}
      {/* {bookedAppointments.map((appointment) => (
          <li key={appointment.id} className="appointment-info" onClick={() => handleToggleExpand(appointment.id)}>
            Doctor Id: {appointment.doctor_id} 
            <br></br>Date: {appointment.appointment_date} 
            <br></br>Status: {appointment.status}
            <br></br>Patient Id: {appointment.patient_id}
            <button onClick={() => handleCancelAppointment(appointment)} className="cancel-button">Cancel</button>
          </li>
        ))} */}
    </div>
  );
};

export default ManageAppointments;
