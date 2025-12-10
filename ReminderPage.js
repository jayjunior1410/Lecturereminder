import React, { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function ReminderPage({ user }) {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ recipientId:'', title:'', message:'', lectureTime:'' });
  const token = localStorage.getItem('token');

  useEffect(() => {
    // fetch potential recipients (simple approach: fetch all users via admin endpoint if admin; if not, fetch via users endpoint not implemented)
    api.getUsers(token).then(r => setUsers(r.data)).catch(() => {
      // fallback: show a minimal flow: users must know recipientId (in production, create endpoints to list lecturers/students)
      setUsers([]);
    });
  }, []);

  async function submit(e) {
    e.preventDefault();
    try {
      await api.createReminder(form, token);
      alert('Reminder sent');
      setForm({ recipientId:'', title:'', message:'', lectureTime:'' });
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to send reminder');
    }
  }

  return (
    <div>
      <h2>Create Reminder</h2>
      <form onSubmit={submit}>
        <label>Recipient (select)</label>
        <select value={form.recipientId} onChange={e=>setForm({...form, recipientId:e.target.value})} required>
          <option value="">-- Select recipient --</option>
          {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
        </select>
        <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} placeholder="Title" required />
        <textarea value={form.message} onChange={e=>setForm({...form, message:e.target.value})} placeholder="Message" required />
        <input type="datetime-local" value={form.lectureTime} onChange={e=>setForm({...form, lectureTime:e.target.value})} />
        <button type="submit">Send Reminder</button>
      </form>
    </div>
  );
}