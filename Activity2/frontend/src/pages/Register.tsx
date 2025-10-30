import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await api.post('/auth/register', { email, password });
      alert('Registration successful!');
      navigate('/login');
    } catch (err: any) {
      setErr(err?.response?.data?.message || err.message || 'Register failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">Register</h2>
      {err && <div className="bg-red-100 text-red-700 p-2 mb-4">{err}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" required />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" className="w-full p-2 border rounded" required />
        <div className="flex justify-end">
          <button className="px-4 py-2 bg-green-600 text-white rounded">Register</button>
        </div>
      </form>
    </div>
  );
}
