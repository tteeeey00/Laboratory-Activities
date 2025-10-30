import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.access_token; 
      if (!token) throw new Error('No token received from server');
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setErr(err?.response?.data?.message || err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border rounded" required />
        {err && <p className="text-red-500 text-sm">{err}</p>}
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
