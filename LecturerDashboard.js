import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function LecturerDashboard({ user, onLogout }) {
  const [reminders, setReminders] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    api.getReminders(token).then(r => setReminders(r.data)).catch(console.error);
  }, []);

  return (
    <div>
      <h2>Lecturer Dashboard</h2>
      <p>Welcome, {user.name}</p>
      <button onClick={onLogout}>Logout</button>
      <h3>Your Reminders</h3>
      <ul>
        {reminders.map(r => <li key={r._id}>{r.title} - {r.message} - from {r.senderId?.name}</li>)}
      </ul>
      <p><a href="/reminders">Create Reminder</a></p>
    </div>
  );
}