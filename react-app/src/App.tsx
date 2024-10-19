import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import CreateUser from "./components/CreateUser" 

function App() {

  return (
    <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/createuser" element={<CreateUser />} />
    </Routes>
  </Router>
  )
}

export default App
