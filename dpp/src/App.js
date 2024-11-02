import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import Appointments from './Appointments';
import ManageAppointments from './ManageAppointments';
import DoctorManageAppointments from './DoctorManageAppointments';
import MedicalHistory from './MedicalHistory';
import ViewPatients from './ViewPatients';

const OrganDonation = () => (   // Temporary component for Organ Donation
  <div>
    <h2>Organ Donation</h2>
    <p>Register as an organ donor or search for available organs.</p>
  </div>
);

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'main',
      userAppointments: [],
      availableAppointments: [],
      loggedInUser: {
        name: '',
        role: '',
        medicalHistory: [],
      },
    };

    this.bookAppointment = this.bookAppointment.bind(this);
    this.cancelAppointment = this.cancelAppointment.bind(this);
    this.setLoggedInUser = this.setLoggedInUser.bind(this);
    this.completeAppointment = this.completeAppointment.bind(this);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    document.title = 'Doctor Patient Portal';
    
    // Function to retrieve userId from cookies
    function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    }    

    const userId = getCookie('userId');
    const userRole = getCookie('userRole');
    console.log(userId, userRole);
    if (userId) {
      // Fetch additional user data (role, name) if needed
      this.setState({
        loggedInUser: {
          name: 'John Doe', // Set name based on retrieved user ID if necessary
          // role: 'doctor',   // Example role
          role: userRole,
          medicalHistory: [],
        },
      });
    }

  const findUserRole = () =>{
    if(userRole === 'patient'){
      axios.get(`http://127.0.0.1:8000/api/patient/${userId}`)
      .then((response) =>{

        {this.setState({
          loggedInUser: {
            name: response.data.first_name + " " + response.data.last_name, // Set name based on retrieved user ID if necessary
            role: userRole,
            medicalHistory: [],
          },
        })
      }
      });
      }
      else{
        axios.get(`http://127.0.0.1:8000/api/doctor/${userId}`)
        .then((response) =>{
          {this.setState({
          loggedInUser: {
            name: response.data.first_name + " " + response.data.last_name, // Set name based on retrieved user ID if necessary
            role: userRole,
            medicalHistory: [],
          },
        })
      }
      
    }
        )};
      };
  findUserRole();
}

  bookAppointment(appointment) {
    const { loggedInUser } = this.state;
    const updatedAppointment = {
      ...appointment,
      reservedBy: loggedInUser.name,
    };
    this.setState((prevState) => ({
      userAppointments: [...prevState.userAppointments, updatedAppointment],
      availableAppointments: prevState.availableAppointments.filter((a) => a.id !== appointment.id),
    }));
  }

  cancelAppointment(appointment) {
    this.setState((prevState) => ({
      userAppointments: prevState.userAppointments.filter((a) => a.id !== appointment.id),
      availableAppointments: [...prevState.availableAppointments, appointment],
    }));
  }

  completeAppointment(appointment) {
    this.setState((prevState) => ({
      userAppointments: prevState.userAppointments.filter((a) => a.id !== appointment.id),
      loggedInUser: {
        ...prevState.loggedInUser,
        medicalHistory: [...prevState.loggedInUser.medicalHistory, appointment],
      },
    }));
  }

  setLoggedInUser(name, role) {
    this.setState({
      loggedInUser: { name, role },
    });
  }

  logout() {
    this.setState({ loggedInUser: null });
    window.location.href = 'http://localhost:5173';
  }

  render() {
    const { loggedInUser } = this.state;

    return (
      <Router>
        <main>
          <Container>
            <Row>
              <header className="App-header">
                <Col>
                  <h1>Doctor Patient Portal</h1>
                  {loggedInUser.name && (
                    <h2>
                      Welcome, {loggedInUser.name} ({loggedInUser.role})
                    </h2>
                  )}
                </Col>
                <Col>
                  {loggedInUser ? (
                    <button onClick={this.logout} style={{ position: 'relative', left: 300, bottom: 50 }}>
                      Logout
                    </button>
                  ) : (
                    <button onClick={() => window.location.href = 'http://localhost:5173'} style={{ position: 'relative', left: 300, bottom: 50 }}>
                      Login
                    </button>
                  )}
                </Col>
                {loggedInUser.role === 'patient' && (
                  <button
                    onClick={() => window.location.href = 'http://localhost:5173/registerdonor'}
                    style={{ position: 'relative', left: 310, bottom: 50 }}
                  >
                    Register as a donor
                  </button>
                )}
              </header>
            </Row>
            {loggedInUser.role === 'patient' && (
              <nav>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  <li>
                    <Link to="/book-appointment">
                      <button className="button">Book Appointment</button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/medical-history">
                      <button className="button">View Medical History</button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/manage-appointments">
                      <button className="button">Manage Appointments</button>
                    </Link>
                  </li>
                  <li>
                    <Link to="http://localhost:5173/searchdonor">
                      <button className="button">Organ Donation</button>
                    </Link>
                  </li>
                </ul>
              </nav>
            )}

            {loggedInUser.role === 'doctor' && (
              <nav>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                  <li>
                    <Link to="/doctor-manage-appointments">
                      <button className="button">Manage Appointments</button>
                    </Link>
                  </li>
                  <li>
                    <Link to="/view-patients">
                      <button className="button">View Patients</button>
                    </Link>
                  </li>
                </ul>
              </nav>
            )}

            <Row>
              <Routes>
                <Route path="/book-appointment" element={<Appointments bookAppointment={this.bookAppointment} />} />
                <Route path="/medical-history" element={<MedicalHistory medicalHistory={loggedInUser.medicalHistory} />} />
                <Route path="/manage-appointments" element={<ManageAppointments userAppointments={this.state.userAppointments} cancelAppointment={this.cancelAppointment} loggedInUser={this.state.loggedInUser} />} />
                <Route path="/doctor-manage-appointments" element={<DoctorManageAppointments userAppointments={this.state.userAppointments} cancelAppointment={this.cancelAppointment} loggedInUser={this.state.loggedInUser} completeAppointment={this.completeAppointment} />} />
                <Route path="/view-patients" element={<ViewPatients loggedInUser={this.state.loggedInUser} userAppointments={this.state.userAppointments} />} />
                <Route path="http://localhost:5173/searchdonor" element={<OrganDonation />} />
              </Routes>
            </Row>
          </Container>
        </main>
      </Router>
    );
  }
}
