import React, { useState, useEffect } from 'react';
import axios  from 'axios';
import './App.css';

const Appointments = ({ availableAppointments, bookAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState('');

  useEffect(() => {
    const getUserIdFromCookie = () => {
      const cookies = document.cookie.split('; ');
      const userIdCookie = cookies.find((cookie) => cookie.startsWith('userId='));
      //console.log(userIdCookie ? userIdCookie.split('=')[1] : null);
      return userIdCookie ? userIdCookie.split('=')[1] : null;
    };
    const userId = getUserIdFromCookie();
    setUserId(userId);
    
    const getUserFromId = async () => {
      const response = await axios.get(`http://localhost:8000/api/patient/${userId}`);
      const user = response;
      setUserInfo(user);
      //console.log(user);
    }
    getUserFromId();

    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/appointment/');
        //console.log(response.data.results);

        const nullPatientAppointments = response.data.results.map(appointment => {
          if (appointment.patient_id === null) {
            return appointment;
          }
          return null;
        }).filter(appointment => appointment !== null);
        //console.log(nullPatientAppointments);
  
        setAppointments(nullPatientAppointments);

        setSuccess(true);
        setError('');

      } catch (error) {
        setSuccess(false);
        setError('Invalid user. Please create an account.');
      }
    };
    fetchAppointments();
  }, []);
  const handleBookAppointment = async (appointment) => {
    const updatedData = {
      appointment_date: appointment.appointment_date,
      status: appointment.status,
      patient_id: userId,  // Set patient_id to the user's ID
      doctor_id: appointment.doctor_id,
    };
    console.log("appointment: ", appointment);
    console.log("updatedData: ", updatedData);
    try {
      const response = axios.put(`http://localhost:8000/api/appointment/${appointment.id}/`, updatedData);
      //console.log('Updated appointment:', response.data);
      //console.log("appointment data: ", response);
      setAppointments(appointments.filter((a) => a.id !== appointment.id));
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
    //Appointments.fetchAppointments();
    
    //appointments.patient_id = userId;
  };

  return (
    <div>
      <h2>Available Appointments</h2>
      <ul className="appointment-list">
        {appointments.map((appointment) => (
          <li key={appointment.id} className="appointment-info">
            Doctor Id: {appointment.doctor_id} 
            <br></br>Date: {appointment.appointment_date} 
            <br></br>Status: {appointment.status}
            <br></br>Patient Id: {appointment.patient_id}
            <button onClick={() => handleBookAppointment(appointment)}>Book</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;
