import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const ViewPatients = ({ loggedInUser, userAppointments }) => {
  const [patients, setPatients] = useState([]);          // Stores patient data and ids
  const [patientId, setPatientIds] = useState([]);        // Stores patient ids
  const [medicalHistory, setMedicalHistory] = useState({});  // Stores the medical history of selected patient

  // Fetching the appointment data and getting the patient IDs
  const getAppointmentData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get('http://127.0.0.1:8000/api/appointment');
      
      // Filter patients by doctor_id and return an array of patient_ids
      const idArray = response.data.results
        .filter(patient => patient.doctor_id === userId)
        .map(patient => patient.patient_id);

      // Set the patient IDs to state
      setPatientIds(idArray);
    } catch (error) {
      console.log('Error fetching appointments:', error);
    }
  };

  // Fetch patient data using patientId
  const getPatientData = async (patientData) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/patient/${patientData}`);
      return response.data; // Assuming response.data contains the patient details
    } catch (error) {
      console.log('Error fetching patient data:', error);
      return null;
    }
  };

  // Fetch patient data for each patientId (single or multiple)
  const fetchDataPatient = async () => {
    try {
      // If there are multiple patientIds, we map over them and fetch data for each one
      const patientDataPromises = patientId.map(id => getPatientData(id));

      // If there's only one patientId, it will still be treated as a promise array
      const patientData = await Promise.all(patientDataPromises);

      // Filter out null responses (failed API calls)
      const validPatients = patientData.filter(patient => patient !== null);

      // Set the valid patients to the state, combining the patientId and patient data
      const patientsWithId = validPatients.map((patient, index) => ({
        patientId: patientId[index],  // Associate the patientId with the fetched data
        first_name: patient.first_name,
        last_name: patient.last_name,
        // Add any other patient data fields here
      }));

      setPatients(patientsWithId);  // Store both patient data and ids in the state
    } catch (error) {
      console.log('Error fetching patient data:', error);
    }
  };

  // useEffect hook to fetch data when the logged-in user is a doctor and the component mounts
  useEffect(() => {
    if (loggedInUser.role === 'doctor') {
      getAppointmentData();
    }
  }, [loggedInUser]); // Runs only when the logged-in user changes

  // useEffect to trigger fetching patient data once patient IDs have been set
  useEffect(() => {
    if (patientId.length > 0) {
      fetchDataPatient();  // Fetch patient data for each patientId
    }
  }, [patientId]); // Runs when patientId array changes

  // Handle button click for each patient to fetch medical history
  const handleButtonClick = async (patient) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/appointment/`);
      const apArray = response.data.results.filter(id =>
        id === patient.patient_id)
      
      // Set the medical history for the clicked patient
      setMedicalHistory(prev => ({
        ...prev,
        [patient.patientId]: apArray,  // Save medical history by patientId
      }));
    } catch (error) {
      console.log('Error fetching medical history:', error);
    }
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
                <p>{medicalHistory[patient.patientId].medical_record || "No medical history available."}</p>
                <p>Date: {medicalHistory[patient.patientId].appointment_date}</p>
                <p>Status: {medicalHistory[patient.patientId].status}</p>
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
