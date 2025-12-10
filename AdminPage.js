import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function AdminPage({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    api.getUsers(token).then(r => setUsers(r.data)).catch(err => {
      console.error(err);
      alert('Failed to fetch users. Make sure you are admin.');
    });
  }, []);

  return (
    <div>
      <h2>Admin Page</h2>
      <p>Welcome, {user.name}</p>
      <button onClick={onLogout}>Logout</button>
      <h3>All Users</h3>
      <ul>
        {users.map(u => <li key={u._id}>{u.name} - {u.email} - {u.role}</li>)}
      </ul>
    </div>
  );
}