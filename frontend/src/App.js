import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import AdminLogin from './components/AdminLogin';
import AdminDash from './components/AdminDash';
import StudentLogin from './components/StudentLogin';
import StudentSignup from './components/StudentSignup';
import StudentDash from './components/StudentDash';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="admindash" element={<AdminDash />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/studentsignup" element={<StudentSignup />} />
        <Route path="/studentdash" element={<StudentDash />} />
      </Routes>
    </Router>
  );
}

export default App;
