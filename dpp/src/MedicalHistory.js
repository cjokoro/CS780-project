import React, { useState, useEffect } from 'react';
import axios  from 'axios';
import './App.css';

const MedicalHistory = ({ medicalHistory }) => {
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [expandedAppointmentId, setExpandedAppointmentId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/appointment/');
        console.log(response.data.results);

        setCompletedAppointments(response.data.results || [])

        setSuccess(true);
        setError('');

      } catch (error) {
        setSuccess(false);
        setError('Invalid user. Please create an account.');
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div>
      <h2>Your Medical History</h2>
      {completedAppointments.length > 0 ? (
        <ul className="appointment-list">
          {completedAppointments.map((appointment) => (
          <li key={appointment.id} className="appointment-info">
            Doctor Id: {appointment.doctor_id} 
            <br></br>Date: {appointment.appointment_date} 
            <br></br>Status: {appointment.status}
            <br></br>Patient Id: {appointment.patient_id}
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
