import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Appointments from './Appointments';
import ManageAppointments from './ManageAppointments';
import DoctorManageAppointments from './DoctorManageAppointments';
import MedicalHistory from './MedicalHistory';
import ViewPatients from './ViewPatients';

const OrganDonation = () => (   //temporary
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
      userAppointments: [], //store user's booked appointments
      availableAppointments: [],
      loggedInUser: {
        name: 'John Doe',
        role: 'patient', // Role will be set as 'patient' or 'doctor'
        // role: 'doctor',
        medicalHistory: [],
      },
    };

    this.bookAppointment = this.bookAppointment.bind(this);
    this.cancelAppointment = this.cancelAppointment.bind(this);
    this.setLoggedInUser = this.setLoggedInUser.bind(this);  // New method to set user
    this.completeAppointment = this.completeAppointment.bind(this);
  }

  bookAppointment(appointment) {
    const { loggedInUser } = this.state; // Get the logged-in user's info
    const updatedAppointment = {
      ...appointment,
      reservedBy: loggedInUser.name, // Attach the user's name to the appointment
    };
    this.setState((prevState) => ({
      userAppointments: [...prevState.userAppointments, updatedAppointment],
      availableAppointments: prevState.availableAppointments.filter((a) => a.id !== appointment.id),
    }));
  }

  //function to cancel an appointment
  cancelAppointment(appointment) {
    this.setState((prevState) => ({
      userAppointments: prevState.userAppointments.filter((a) => a.id !== appointment.id),
      availableAppointments: [...prevState.availableAppointments, appointment], //return the appointment to the available list
    }));
  }

  completeAppointment(appointment) {
    this.setState((prevState) => ({
      // Remove appointment from userAppointments
      userAppointments: prevState.userAppointments.filter((a) => a.id !== appointment.id),
      // Add appointment to medical history
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

  componentDidMount() {
    document.title = 'Doctor Patient Portal';
  }

  render(){
    const { loggedInUser } = this.state;

    return (
      <Router>
        <main>
          <Container>
            <Row>
              <header className="App-header">
                <Col>
                  <h1>Doctor Patient Portal</h1>
                  {loggedInUser.name && <h2>Welcome, {loggedInUser.name} ({loggedInUser.role})</h2>}
                </Col>
                <Col>
                  <Link>
                    <button style={{position: 'relative', left: 300, bottom: 50}}>Login button</button>
                    {/* take to login page Chidera made */}
                  </Link>
                </Col>
                
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
                      <Link to="/organ-donation">
                        <button class="button">Organ Donation</button>
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
                <Route path="/medical-history" element={<MedicalHistory medicalHistory={loggedInUser.medicalHistory}/>} />
                <Route path="/manage-appointments" element={<ManageAppointments userAppointments={this.state.userAppointments} cancelAppointment={this.cancelAppointment} loggedInUser={this.state.loggedInUser} />} />
                <Route path="/doctor-manage-appointments" element={<DoctorManageAppointments userAppointments={this.state.userAppointments} cancelAppointment={this.cancelAppointment} loggedInUser={this.state.loggedInUser} completeAppointment={this.completeAppointment}/>} />
                <Route path="/view-patients" element={ <ViewPatients loggedInUser={this.state.loggedInUser} userAppointments={this.state.userAppointments}/> } />
                <Route path="/organ-donation" element={<OrganDonation />} />
                {/* <Route path="/view-patients" element={<ViewPatients />} /> */}
              </Routes>
            </Row>
          </Container>
        </main>
      </Router>
    );
  }
}


