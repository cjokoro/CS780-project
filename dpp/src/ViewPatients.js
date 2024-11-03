import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const ViewPatients = ({ loggedInUser, userAppointments }) => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Only fetch patients if the logged-in user is a doctor
    if (loggedInUser.role === 'doctor') {
      axios.get('http://127.0.0.1:8000/api/appointment')
      .then((response) =>{
        console.log(response.data.results)
      })

      // Get a list of unique patients for this doctor based on the appointments
      const doctorPatients = userAppointments
        .filter((appointment) => appointment.doctor === loggedInUser.name)
        .map((appointment) => appointment.patientName);
      
      // Remove duplicates from the patient list
      const uniquePatients = [...new Set(doctorPatients)];

      setPatients(uniquePatients);
    }
  }, [loggedInUser, userAppointments]);

  return (
    <div>
      <h2>Your Patients</h2>
      {patients.length > 0 ? (
        <ul className="patient-list">
          {patients.map((patient, index) => (
            <li key={index} className="patient-info">
              {patient}
            </li>
          ))}
        </ul>
      ) : (
        <p>No patients found.</p>
      )}
    </div>
  );
};

export default ViewPatients;
