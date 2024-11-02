import React, { useState, useEffect } from 'react';
import axios  from 'axios';
import './App.css';

const Appointments = ({ availableAppointments, bookAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
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
        console.log(nullPatientAppointments);
  
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
  const handleBookAppointment = (appointment) => {
    //all the bookAppointment function passed via props
    bookAppointment({
      ...appointment,
    });
    //remove the booked appointment from available appointments
    // setAppointments(appointments.filter((a) => a.id !== appointment.id));

    //appointments.patient_id = loggedInUser.id;                                    MAKE THIS SO IT JUST CHANGES THE PATIENT ID TO THE USER'S ID
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
