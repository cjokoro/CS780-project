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
  const [doctorInfoMap, setDoctorInfoMap] = useState({});

  useEffect(() => {
    const getUserIdFromCookie = () => {
      const cookies = document.cookie.split('; ');
      const userIdCookie = cookies.find((cookie) => cookie.startsWith('userId='));
      return userIdCookie ? userIdCookie.split('=')[1] : null;
    };
    const userId = getUserIdFromCookie();
    setUserId(userId);
    
    const getUserFromId = async () => {
      const response = await axios.get(`http://localhost:8000/api/patient/${userId}`);
      const user = response;
      setUserInfo(user);
    }
    getUserFromId();

    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/appointment/');
        const nullPatientAppointments = response.data.results.map(appointment => {
          if (appointment.patient_id === null) {
            return appointment;
          }
          return null;
        }).filter(appointment => appointment !== null);

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
    const utcDate = new Date(datetime);
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
      setAppointments(appointments.filter((a) => a.id !== appointment.id));
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  return (
    <div>
      <h2>Available Appointments</h2>
      <ul className="appointment-list">
        {appointments.map((appointment) => {
          const doctor = doctorInfoMap[appointment.doctor_id];

          if (!doctor) {
            fetchDoctorInfo(appointment.doctor_id);
          }

          return (
            <li key={appointment.id} className="appointment-info">
              Doctor: {doctor ? `${doctor.first_name} ${doctor.last_name}` : 'Loading...'}
              <br />Date: {formatDateTime(appointment.appointment_date)}
              <br />Status: {appointment.status}
              <br />Patient Name: No Patient
              <button onClick={() => handleBookAppointment(appointment)}>Book</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Appointments;
