import React, { useState, useEffect, useRef } from 'react';
import axios  from 'axios';
import { useNavigate } from 'react-router-dom';
import './App.css';

const Appointments = ({ availableAppointments, bookAppointment, currentPage }) => {
  const [appointments, setAppointments] = useState([]);
  const [reason, setReason] = useState(true); 
  const [success, setSuccess] = useState(null); // State for success feedback
  const [error, setError] = useState('');       // State for error feedback
  const navigate = useNavigate();

  

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/appointment/');
        console.log(response);

        setAppointments(response.data.results || []);

        setSuccess(true);
        setError('');

      } catch (error) {
        setSuccess(false);
        setError('Invalid user. Please create an account.');
      }
    };

    fetchAppointments();
  }, [currentPage, navigate]);
// const availableAppointments = [
    //   { id: 1, doctor: 'Dr. Smith', patientName: 'John Doe', time: '10:00 AM' },
    //   { id: 2, doctor: 'Dr. Smith', patientName: 'Jane Doe', time: '11:00 AM' },
    //   { id: 3, doctor: 'Dr. Smith', patientName: 'John Doe', time: '2:00 PM' },
    //   { id: 4, doctor: 'Dr. Lee', patientName: 'Sam Smith', time: '3:00 PM' },
    // ];
    // setAppointments(availableAppointments);
  const handleBookAppointment = (appointment) => {
    //all the bookAppointment function passed via props
    bookAppointment({
      ...appointment,
      reason: reason,    // Add reason field
    });

    //remove the booked appointment from available appointments
    setAppointments(appointments.filter((a) => a.id !== appointment.id));
  };

  return (
    <div>
      <h2>Available Appointments</h2>
      <ul class="appointment-list">
        {appointments.map((appointment) => (
          <li key={appointment.id} class="appointment-info">
            doctor ID: {appointment.doctor_id} 
            <br></br>Date: {appointment.appointment_date} 
            <br></br>Status: {appointment.status}
            <label>
                Reason:
                <input 
                  type="text" 
                  value={reason} 
                  onChange={(e) => setReason(e.target.value)} 
                  placeholder="Reason for visit" 
                />
              </label>
            <button onClick={() => handleBookAppointment(appointment)}>Book</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Appointments;
