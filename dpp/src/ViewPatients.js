import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';


const ViewPatients = ({ loggedInUser, userAppointments }) => {
  const [patients, setPatients] = useState([]); // Stores patient data and ids
  const [patientId, setPatientIds] = useState([]); // Stores patient ids
  const [medicalHistory, setMedicalHistory] = useState({}); // Stores the medical history of selected patient


  const getAppointmentData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get('http://127.0.0.1:8000/api/appointment');
     
      const idArray = response.data.results
        .filter(patient => patient.doctor_id === userId)
        .map(patient => patient.patient_id);


      setPatientIds(idArray);
    } catch (error) {
      console.log('Error fetching appointments:', error);
    }
  };


  const getPatientData = async (patientData) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/patient/${patientData}`);
      return response.data;
    } catch (error) {
      console.log('Error fetching patient data:', error);
      return null;
    }
  };


  const fetchDataPatient = async () => {
    try {
      const patientDataPromises = patientId.map(id => getPatientData(id));
      const patientData = await Promise.all(patientDataPromises);
      const validPatients = patientData.filter(patient => patient !== null);


      const patientsWithId = validPatients.map((patient, index) => ({
        patientId: patientId[index],
        first_name: patient.first_name,
        last_name: patient.last_name,
      }));


      setPatients(patientsWithId);
    } catch (error) {
      console.log('Error fetching patient data:', error);
    }
  };


  useEffect(() => {
    if (loggedInUser.role === 'doctor') {
      getAppointmentData();
    }
  }, [loggedInUser]);


  useEffect(() => {
    if (patientId.length > 0) {
      fetchDataPatient();
    }
  }, [patientId]);


  const handleButtonClick = async (patient) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/medical-record/?patient=${patient.patientId}`);
      setMedicalHistory(prev => ({
        ...prev,
        [patient.patientId]: response.data.results,
     
      }));
    } catch (error) {
      console.log('Error fetching medical history:', error);
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


  return (
    <div>
      <h2>Your Patients</h2>
      {patients.length > 0 ? (
        <div>
          {patients.map((patient, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <span>{patient.first_name} {patient.last_name}</span>
              <button
                onClick={() => handleButtonClick(patient)}
                style={{ marginLeft: '10px' }}
              >
                View Medical History
              </button>
              {medicalHistory[patient.patientId] && (
                <div style={{ marginTop: '10px', padding: '10px', background: '#f9f9f9' }}>
                  <h4>Medical History:</h4>
                  {medicalHistory[patient.patientId].length > 0 ? (
                    medicalHistory[patient.patientId].map((record, recordIndex) => (
                      <div key={recordIndex} style={{ marginBottom: '5px' }}>
                        <p>Record Date: {record.created_at ? formatDateTime(record.created_at) : "N/A"}</p>
                        <p>Diagnosis: {record.diagnosis}</p>
                        <p>Prescription: {record.prescription}</p>
                        <p>------------------------------------------</p>
                      </div>
                    ))
                  ) : (
                    <p>No medical history available.</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No patients found.</p>
      )}
    </div>
  );
};


export default ViewPatients;
