import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', role:'student' });
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api.register(form);
      alert('Registered. Please login.');
      nav('/login');
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  }
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={submit}>
        <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} placeholder="Name" required />
        <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} placeholder="Email" required />
        <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} placeholder="Password" required />
        <select value={form.role} onChange={e=>setForm({...form, role:e.target.value})}>
          <option value="student">Student</option>
          <option value="lecturer">Lecturer</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}