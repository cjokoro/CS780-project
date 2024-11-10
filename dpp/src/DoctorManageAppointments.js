import React, { useState, useEffect } from 'react';
import axios  from 'axios';
import './App.css';

const DoctorManageAppointments = ({ userAppointments, cancelAppointment, loggedInUser, completeAppointment }) => {
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [expandedAppointmentId, setExpandedAppointmentId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [patientInfoMap, setPatientInfoMap] = useState({});

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
        setUserInfo(user);
  
        const response = await axios.get('http://localhost:8000/api/appointment/');
        const nullDoctorAppointments = response.data.results
          .map(appointment => appointment.doctor_id === user.id ? appointment : null)
          .filter(appointment => appointment !== null && appointment.status !== 'completed' && appointment.patient_id !== null);
  
        setBookedAppointments(nullDoctorAppointments);
        setSuccess(true);
        setError('');
      } catch (error) {
        setSuccess(false);
        setError('Invalid user. Please create an account.');
      }
    };
  
    const getUserFromId = async () => {
      const response = await axios.get(`http://localhost:8000/api/doctor/${userId}`);
      return response.data;
    };
  
    fetchUserData();
  }, []);

  const fetchPatientInfo = async (patient_id) => {
    if (!patientInfoMap[patient_id]) {
      try {
        const response = await axios.get(`http://localhost:8000/api/patient/${patient_id}`);
        setPatientInfoMap((prev) => ({ ...prev, [patient_id]: response.data }));
      } catch (error) {
        console.error(`Error fetching patient info for patient_id ${patient_id}:`, error);
      }
    }
  };

  const formatDateTime = (datetime) => {
    // Parse the UTC datetime
    const utcDate = new Date(datetime);
    
    // Create a local date by adjusting the UTC offset
    const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);

    const options = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/Chicago'
    };
    
    return new Intl.DateTimeFormat('en-US', options).format(localDate);
  };

  const handleCancelAppointment = async (appointment) => {
    try {
      // Send a PATCH request to update the appointment's doctor_id to null
      await axios.patch(`http://localhost:8000/api/appointment/${appointment.id}/`, {
        patient_id: null
      });
      
      // Update the bookedAppointments state by removing the canceled appointment
      setBookedAppointments(bookedAppointments.filter((a) => a.id !== appointment.id));
      
      setSuccess(true);
      setError('');
    } catch (error) {
      setSuccess(false);
      setError('Failed to cancel the appointment. Please try again.');
    }
  };

  const handleCompleteAppointment = async (appointment) => {
    try {
      // Send a PATCH request to update the appointment's status to "completed"
      const updatedAppointment = await axios.patch(`http://localhost:8000/api/appointment/${appointment.id}/`, {
        status: 'completed'
      });
      
      // Update the bookedAppointments state with the modified appointment
      setBookedAppointments(bookedAppointments.filter((a) => a.id !== appointment.id));
      
      setSuccess(true);
      setError('');
    } catch (error) {
      setSuccess(false);
      setError('Failed to complete the appointment. Please try again.');
    }
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
        {bookedAppointments.map((appointment) => {
          const patient = patientInfoMap[appointment.patient_id];

          if (!patient) {
            fetchPatientInfo(appointment.patient_id);
          }
          return (
            <li key={appointment.id} className="appointment-info">
              Doctor: {userInfo ? `${userInfo.first_name} ${userInfo.last_name}` : 'Loading...'}
              <br />Date: {formatDateTime(appointment.appointment_date)}
              <br />Status: {appointment.status}
              <br />Patient Name: {patient ? `${patient.first_name} ${patient.last_name}` : 'Loading...'}
              <div>
                <button onClick={() => handleCompleteAppointment(appointment)} className="complete-button" style={{margin: 7}}>
                  Complete
                </button>
                <button onClick={() => handleCancelAppointment(appointment)} className="cancel-button">
                  Cancel
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      ) : (
        <p>You have no appointments.</p>
      )}
    </div>
  );
};

export default DoctorManageAppointments;
