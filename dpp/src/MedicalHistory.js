import React, { useState, useEffect } from 'react';
import axios  from 'axios';
import './App.css';

const MedicalHistory = ({ medicalHistory }) => {
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [expandedAppointmentId, setExpandedAppointmentId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    const getUserIdFromCookie = () => {
      const cookies = document.cookie.split('; ');
      const userIdCookie = cookies.find((cookie) => cookie.startsWith('userId='));
      return userIdCookie ? userIdCookie.split('=')[1] : null;
    };
    
    const userId = getUserIdFromCookie();
    setUserId(userId);
  
    const fetchUserData = async () => {
      try {
        const user = await getUserFromId();
        setUserInfo(user); // Set userInfo after user data is fetched
  
        const response = await axios.get('http://localhost:8000/api/appointment/');
        const nullPatientAppointments = response.data.results
          .map(appointment => appointment.patient_id === user.id ? appointment : null)
          .filter(appointment => appointment !== null && appointment.status === 'completed');
  
        setCompletedAppointments(nullPatientAppointments);
        setSuccess(true);
        setError('');
      } catch (error) {
        setSuccess(false);
        setError('Invalid user. Please create an account.');
      }
    };
  
    const getUserFromId = async () => {
      const response = await axios.get(`http://localhost:8000/api/patient/${userId}`);
      return response.data;
    };
  
    fetchUserData();
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
