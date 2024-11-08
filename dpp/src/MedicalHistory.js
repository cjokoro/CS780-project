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
  const [doctorInfoMap, setDoctorInfoMap] = useState({});


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

  const fetchDoctorInfo = async (doctor_id) => {
    if (!doctorInfoMap[doctor_id]) {
      try {
        const response = await axios.get(`http://localhost:8000/api/doctor/${doctor_id}`);
        setDoctorInfoMap((prev) => ({ ...prev, [doctor_id]: response.data }));
      } catch (error) {
        console.error(`Error fetching doctor info for doctor_id ${doctor_id}:`, error);
      }
    }
  };

  const formatDateTime = (datetime) => {
    const date = new Date(datetime);
    const options = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

  return (
    <div>
      <h2>Your Medical History</h2>
      {completedAppointments.length > 0 ? (
        <ul className="appointment-list">
          {completedAppointments.map((appointment) => {
          const doctor = doctorInfoMap[appointment.doctor_id];

          if (!doctor) {
            fetchDoctorInfo(appointment.doctor_id);
          }

          return (
            <li key={appointment.id} className="appointment-info">
              Doctor: {doctor ? `${doctor.first_name} ${doctor.last_name}` : 'Loading...'}
              <br />Date: {formatDateTime(appointment.appointment_date)}
              <br />Status: {appointment.status}
              <br />Patient Name: {userInfo ? `${userInfo.first_name} ${userInfo.last_name}` : 'Loading...'}
            </li>
          );
        })}
        </ul>
      ) : (
        <p>No medical history available.</p>
      )}
    </div>
  );
};

export default MedicalHistory;
