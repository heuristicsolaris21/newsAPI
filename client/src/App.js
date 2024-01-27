import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/Dash-board" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/admin-login" />} />
      </Routes>
    </Router>
  );
}

export default App;