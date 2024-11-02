import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import CreateUser from "./components/CreateUser" 
import RegisterDonor from "./components/RegisterDonor";
import SearchDonor from "./components/SearchDonor";

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/createuser" element={<CreateUser />} />
      <Route path="/registerdonor" element={<RegisterDonor/>} />
      <Route path="/searchdonor" element={<SearchDonor/>} />
    </Routes>
  </Router>
  )
}

export default App
