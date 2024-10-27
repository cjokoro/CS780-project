import React, { useState, useEffect, useRef } from 'react';
import axios  from 'axios';
import './App.css';

const Appointments = ({ availableAppointments, bookAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [reason, setReason] = useState(true); 

  useEffect(() => {
    //simulate fetching appointments data from database
    
    // try{
    //   const response = axios.get('http://localhost:8000/api/appointment/');
    //   console.log(response);

    //   // const { access, refresh } = response.data;
    //   // localStorage.setItem('accessToken', access);
    //   // localStorage.setItem('refreshToken', refresh);

    //   // setSuccess(true);
    //   // setError('');

    //   // if (currentPage === 'doctor') {
    //   //     navigate('/dashboarddoctor'); // Change to your desired doctor route
    //   // } else if (currentPage === 'patient') {
    //   //     navigate('/dashboardpatient'); // Change to your desired patient route
    //   // }
    // }
    // catch(error){
    //   // setSuccess(false);
    //   // setError('Invalid user. Please create an account.');
    // }
    //setReason(!reason)
    const availableAppointments = [
      { id: 1, doctor: 'Dr. Smith', patientName: 'John Doe', time: '10:00 AM' },
      { id: 2, doctor: 'Dr. Smith', patientName: 'Jane Doe', time: '11:00 AM' },
      { id: 3, doctor: 'Dr. Smith', patientName: 'John Doe', time: '2:00 PM' },
      { id: 4, doctor: 'Dr. Lee', patientName: 'Sam Smith', time: '3:00 PM' },
    ];
    setAppointments(availableAppointments);
  }, []);

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
            {appointment.doctor} - {appointment.time}
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
