import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const DoctorManageAppointments = ({ userAppointments, cancelAppointment, loggedInUser, completeAppointment }) => {
  const [bookedAppointments, setBookedAppointments] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [patientInfoMap, setPatientInfoMap] = useState({});
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');

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
        const nullDoctorAppointments = response.data.results
          .map(appointment => 
            appointment.doctor_id === user.id ? { ...appointment, showModal: false } : null
          )
          .filter(appointment => appointment !== null && appointment.status !== 'completed' && appointment.patient_id !== null);

        setBookedAppointments(nullDoctorAppointments);
        setSuccess(true);
        setError('');
      } catch (error) {
        setSuccess(false);
        setError('Invalid user. Please create an account.');
      }
    };

    const getUserFromId = async () => {
      const response = await axios.get(`http://localhost:8000/api/doctor/${userId}`);
      return response.data;
    };

    fetchUserData();
  }, []);

  const fetchPatientInfo = async (patient_id) => {
    if (!patientInfoMap[patient_id]) {
      try {
        const response = await axios.get(`http://localhost:8000/api/patient/${patient_id}`);
        setPatientInfoMap((prev) => ({ ...prev, [patient_id]: response.data }));
      } catch (error) {
        console.error(`Error fetching patient info for patient_id ${patient_id}:`, error);
      }
    }
  };

  const handleCompleteButtonClick = (appointmentId) => {
    setBookedAppointments(prevAppointments =>
      prevAppointments.map(a => 
        a.id === appointmentId ? { ...a, showModal: !a.showModal } : a
      )
    );
  };

  const handleCompleteAppointment = async (appointmentId) => {
    const appointment = bookedAppointments.find(a => a.id === appointmentId);
    if (!diagnosis || !prescription) {
      setError('Please fill in both fields.');
      return;
    }

    try {
      await axios.patch(`http://localhost:8000/api/appointment/${appointment.id}/`, {
        status: 'completed'
      });
      await axios.post('http://localhost:8000/api/medical-record/', {
        diagnosis,
        prescription,
        appointment_id: appointment.id,
        patient: appointment.patient_id
      });

      setBookedAppointments(prevAppointments =>
        prevAppointments.map(a => (a.id === appointmentId ? { ...a, showModal: false } : a))
      );
      setBookedAppointments(bookedAppointments.filter((a) => a.id !== appointmentId));
      setSuccess(true);
      setError('');
      setDiagnosis('');
      setPrescription('');
    } catch (error) {
      setSuccess(false);
      setError('Failed to complete the appointment. Please try again.');
    }
  };
  const handleCancelAppointment = async (appointment) => {
    try {
      // Send a PATCH request to update the appointment's patient_id to null
      await axios.patch(`http://localhost:8000/api/appointment/${appointment.id}/`, {
        patient_id: null
      });
      
      // Update the bookedAppointments state by removing the canceled appointment
      setBookedAppointments(bookedAppointments.filter((a) => a.id !== appointment.id));
      
      setSuccess(true);
      setError('');
    } catch (error) {
      setSuccess(false);
      setError('Failed to cancel the appointment. Please try again.');
    }
  };
  return (
    <div>
      <h2>Your Booked Appointments</h2>
      {bookedAppointments.length > 0 ? (
        <ul className="appointment-list">
          {bookedAppointments.map((appointment) => {
            const patient = patientInfoMap[appointment.patient_id];

            if (!patient) {
              fetchPatientInfo(appointment.patient_id);
            }

            return (
              <li key={appointment.id} className="appointment-info">
                Doctor: {userInfo ? `${userInfo.first_name} ${userInfo.last_name}` : 'Loading...'}
                <br />Date: {appointment.appointment_date}
                <br />Status: {appointment.status}
                <br />Patient Name: {patient ? `${patient.first_name} ${patient.last_name}` : 'Loading...'}
                <div>
                  <button onClick={() => handleCompleteButtonClick(appointment.id)} className="complete-button" style={{ margin: 7 }}>
                    Complete
                  </button>
                  <button onClick={() => handleCancelAppointment(appointment)} className="cancel-button">
                    Cancel
                  </button>
                </div>

                {appointment.showModal && (
                  <div className="modal">
                    <div className="modal-content">
                      <h3>Complete Appointment</h3>
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        handleCompleteAppointment(appointment.id);
                      }}>
                        <label>
                          Diagnosis:
                          <input
                            type="text"
                            value={diagnosis}
                            onChange={(e) => setDiagnosis(e.target.value)}
                            required
                          />
                        </label>
                        <label>
                          Prescription:
                          <input
                            type="text"
                            value={prescription}
                            onChange={(e) => setPrescription(e.target.value)}
                            required
                          />
                        </label>
                        <button type="submit">Submit</button>
                        <button onClick={() => handleCompleteButtonClick(appointment.id)}>Close</button>
                      </form>
                      {error && <p style={{ color: 'red' }}>{error}</p>}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p>You have no appointments.</p>
      )}
    </div>
  );
};

export default DoctorManageAppointments;
