import React, { useState, useEffect } from 'react';
import axios  from 'axios';
import './App.css';

const CreateAppointment = ({ availableAppointments, bookAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState('');
  //const [doctorId, setDoctorId] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [status, setStatus] = useState('Scheduled'); // Default status
  //const [patientId, setPatientId] = useState('');
  debugger;
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
      const response = await axios.get(`http://localhost:8000/api/doctor/${userId}`);
      const user = response;
      setUserInfo(user);
      //console.log(user);
    }
    getUserFromId();

    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/appointment/');
        //console.log(response.data.results);

        const nullDoctorAppointments = response.data.results.map(appointment => {
          if (appointment.patient_id === null && appointment.doctor_id === userId) {
            return appointment;
          }
          return null;
        }).filter(appointment => appointment !== null);
        //console.log(nullPatientAppointments);
  
        setAppointments(nullDoctorAppointments);

        setSuccess(true);
        setError('');

      } catch (error) {
        setSuccess(false);
        setError('Invalid user. Please create an account.');
      }
    };
    fetchAppointments();
  }, []);

  const handleCreateAppointment = async (event) => {
    event.preventDefault();
    
    const newAppointment = {
      doctor_id: userId,
      appointment_date: appointmentDate,
      status: status,
      patient_id: null,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/appointment/', newAppointment);
      setAppointments([...appointments, response.data]); // Add new appointment to list
      //setDoctorId('');
      setAppointmentDate('');
      setStatus('Scheduled');
      //setPatientId('');
      alert('Appointment created successfully!');
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert('Failed to create appointment. Please try again.');
    }
  };

  const deleteAppointment = async (appointment) => {
    const confirmation = window.confirm(`Are you sure you want to delete appointment on ${appointment.appointment_date}?`);
    if (!confirmation) return;

    try {
      await axios.delete(`http://localhost:8000/api/appointment/${appointment.id}/`);
      setAppointments(appointments.filter((a) => a.id !== appointment.id)); // Update state to remove deleted appointment
      alert('Appointment deleted successfully!');
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert('Failed to delete appointment. Please try again.');
    }
  };

  return (
    <div>
      <h2>Create an Appointment</h2>
      <form onSubmit={handleCreateAppointment}>
        <label>
          Appointment Date:
          <input
            type="datetime-local"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
        Status:
          <input
            type="text"
            value={status}
            placeholder="Input status"
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Create Appointment</button>
      </form>
      <h2>Your Available Appointments</h2>
      <ul className="appointment-list">
        {appointments.map((appointment) => (
          <li key={appointment.id} className="appointment-info">
            Doctor Id: {appointment.doctor_id} 
            <br></br>Date: {appointment.appointment_date} 
            <br></br>Status: {appointment.status}
            <br></br>Patient Id: {appointment.patient_id}
            <button onClick={() => deleteAppointment(appointment)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateAppointment;
