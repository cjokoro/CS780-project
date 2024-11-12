import React, { useState, useEffect } from 'react';
import axios  from 'axios';
import './App.css';

const MedicalHistory = ({ medicalHistory }) => {
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [expandedAppointmentId, setExpandedAppointmentId] = useState(null);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [doctorInfoMap, setDoctorInfoMap] = useState({});
  const [medicalRecords, setMedicalRecords] = useState([]);

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
        setUserInfo(user);
  
        const response = await axios.get('http://localhost:8000/api/appointment/');
        const nullPatientAppointments = response.data.results
          .map(appointment => appointment.patient_id === user.id ? appointment : null)
          .filter(appointment => appointment !== null && appointment.status === 'completed');
  
        setCompletedAppointments(nullPatientAppointments);
        setSuccess(true);
        setError('');

        fetchMedicalRecord(user.id);
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

  // New function to fetch medical records
  const fetchMedicalRecord = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/medical-record/`);
      const userRecords = response.data.results.filter(record => record.patient === userId);

        
        //.filter(record => record.patient_id === userId);
      setMedicalRecords(userRecords); // Store only the filtered records
      
    } catch (error) {
      console.error("Error fetching medical records:", error);
      setError("Failed to fetch medical records.");
    }
  };

  return (
    <div>
      <h2>Your Medical Records</h2>
      {error && <p>{error}</p>}
      
      {medicalRecords.length > 0 ? (
        <ul className="appointment-list">
          {medicalRecords.map((record) => {
            debugger;
            if (!record.appointment) {
              return <li key={record.id} className="appointment-info">Appointment details not available.</li>;
            }

            const doctorId = record.appointment.doctor_id;
            const doctor = doctorId ? doctorInfoMap[doctorId] : null;
            
            if (!doctor && doctorId) {
              fetchDoctorInfo(doctorId);
            }

            return (
              <li key={record.id} className="appointment-info">
                Doctor: {doctor ? `${doctor.first_name} ${doctor.last_name}` : 'Loading...'}
                <br />Diagnosis: {record.diagnosis}
                <br />Prescription: {record.prescription}
                <br />Date: {formatDateTime(record.created_at)}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No medical records available.</p>
      )}
    </div>
  );
};

export default MedicalHistory;
