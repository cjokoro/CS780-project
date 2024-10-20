import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import CreateUser from "./components/CreateUser" 
import DashboardPatient from "./components/DashboardPatient";
import DashboardDoctor from "./components/DashboardDoctor";

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/createuser" element={<CreateUser />} />
      <Route path="/dashboardpatient" element={<DashboardPatient/>} />
      <Route path="/dashboarddoctor" element={<DashboardDoctor/>} />
    </Routes>
  </Router>
  )
}

export default App
