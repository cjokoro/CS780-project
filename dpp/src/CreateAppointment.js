import React, { useState, useEffect } from 'react';
import axios  from 'axios';
import './App.css';

const CreateAppointment = ({ availableAppointments, bookAppointment }) => {
  const [appointments, setAppointments] = useState([]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState('');
  const [userInfo, setUserInfo] = useState('');
  const [appointmentDate, setAppointmentDate] = useState('');
  const [status, setStatus] = useState('Scheduled');
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
      const response = await axios.get(`http://localhost:8000/api/doctor/${userId}`);
      const user = response;
      setUserInfo(user);
    }
    getUserFromId();

    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/appointment/');

        const nullDoctorAppointments = response.data.results.map(appointment => {
          if (appointment.patient_id === null && appointment.doctor_id === userId) {
            return appointment;
          }
          return null;
        }).filter(appointment => appointment !== null);
  
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
      setAppointments([...appointments, response.data]);
      setAppointmentDate('');
      setStatus('Scheduled');
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
      setAppointments(appointments.filter((a) => a.id !== appointment.id));
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
      {appointments.length > 0 ? (
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
              <button onClick={() => deleteAppointment(appointment)}>Delete</button>
            </li>
          );
        })}
      </ul>
      ) : (
        <p>No unbooked appointments.</p>
      )}
    </div>
  );
};

export default CreateAppointment;
