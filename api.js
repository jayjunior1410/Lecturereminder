import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

export const api = {
  register: (data) => axios.post(`${API_BASE}/auth/register`, data),
  login: (data) => axios.post(`${API_BASE}/auth/login`, data),
  getReminders: (token) => axios.get(`${API_BASE}/reminders`, { headers: authHeaders(token) }),
  createReminder: (data, token) => axios.post(`${API_BASE}/reminders`, data, { headers: authHeaders(token) }),
  markRead: (id, token) => axios.put(`${API_BASE}/reminders/${id}/read`, {}, { headers: authHeaders(token) }),
  getUsers: (token) => axios.get(`${API_BASE}/users`, { headers: authHeaders(token) })
};