import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import api from './axios';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    try {
      console.log('Sending logout request to /api/logout');
      const response = await api.post('/logout');
      console.log('Logout response:', response.data);
      localStorage.removeItem('token'); // Clear token if used
      setUser(null); // Clear user state
      alert('Logged out successfully'); // Provide feedback
    } catch (err) {
      console.error('Logout failed:', err);
      alert('Failed to log out');
    }
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/auth" element={<Auth setUser={setUser} user={user} />} />
          <Route
            path="/student"
            element={
              user && user.role === 'ROLE_STUDENT' ? (
                <StudentDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user && user.role === 'ROLE_ADMIN' ? (
                <AdminDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/auth" />
              )
            }
          />
          <Route path="/" element={<Navigate to="/auth" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;