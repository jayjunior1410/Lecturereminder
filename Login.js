import React, { useState } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [form, setForm] = useState({ email:'', password:'' });
  const nav = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const res = await api.login(form);
      const { token, user } = res.data;
      // Save token if you want to call API
      localStorage.setItem('token', token);
      onLogin(user);
      nav(`/${user.role}`);
    } catch (err) {
      alert(err.response?.data?.msg || 'Login failed');
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <input type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
        <input type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}