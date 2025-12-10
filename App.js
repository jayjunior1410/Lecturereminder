import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard';
import LecturerDashboard from './pages/LecturerDashboard';
import AdminPage from './pages/AdminPage';
import ReminderPage from './pages/ReminderPage';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:4000';

function App() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  });
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (user) {
      const s = io(SOCKET_URL);
      s.on('connect', () => {
        s.emit('identify', user.id);
      });
      s.on('reminder', (reminder) => {
        // Simple alert; replace with toast or UI update
        alert(`New reminder: ${reminder.title} - ${reminder.message}`);
      });
      setSocket(s);
      return () => s.disconnect();
    }
  }, [user]);

  function handleLogin(userObj) {
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj);
  }
  function handleLogout() {
    localStorage.removeItem('user');
    setUser(null);
    if (socket) socket.disconnect();
    setSocket(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ user ? <Navigate to={`/${user.role}`} /> : <Navigate to="/login" /> } />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={user && user.role==='student' ? <StudentDashboard user={user} onLogout={handleLogout}/> : <Navigate to="/login" />} />
        <Route path="/lecturer" element={user && user.role==='lecturer' ? <LecturerDashboard user={user} onLogout={handleLogout}/> : <Navigate to="/login" />} />
        <Route path="/admin" element={user && user.role==='admin' ? <AdminPage user={user} onLogout={handleLogout}/> : <Navigate to="/login" />} />
        <Route path="/reminders" element={user ? <ReminderPage user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;