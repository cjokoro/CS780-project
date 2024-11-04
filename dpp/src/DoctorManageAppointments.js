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
          .filter(appointment => appointment !== null && appointment.status !== 'completed');
  
        setBookedAppointments(nullPatientAppointments);
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

  const handleCancelAppointment = async (appointment) => {
    try {
      // Send a PATCH request to update the appointment's patient_id to null
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
      setBookedAppointments(
        bookedAppointments.map((a) => 
          a.id === appointment.id ? { ...a, status: updatedAppointment.data.status } : a
        )
      );
      
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
      <ul className="appointment-list">
      {bookedAppointments.length > 0 ? (
          bookedAppointments.map((appointment) => (
            <li key={appointment.id}>
              <div className="appointment-info" onClick={() => handleToggleExpand(appointment.id)}>
                {appointment.doctor} - {appointment.time} (Reserved by: {appointment.reservedBy})
              </div>
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
