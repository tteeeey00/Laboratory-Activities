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
      const { access_token: token, user } = res.data;
      if (!token) throw new Error('No token received from server');
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', user?.name || email.split('@')[0]);
      navigate('/');
    } catch (err: any) {
      console.error('Login error:', err);
      setErr(err?.response?.data?.message || err.message || 'Invalid email or password.');
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-3xl text-white">📝</span>
          </div>
        </div>
        
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          Notes App
          <p className="text-blue-600 text-2xl mt-1">Sign in to continue</p>
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">EMAIL</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">PASSWORD</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              required 
            />
          </div>

          {err && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {err}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200"
          >
            LOGIN
          </button>

          <div className="text-center space-y-2">
            <a href="#" className="text-sm text-gray-600 hover:text-blue-500">FORGOT PASSWORD?</a>
            <div className="text-sm text-gray-600">OR</div>
            <a href="/register" className="text-sm text-red-600 hover:text-red-700">DON'T HAVE AN ACCOUNT?</a>
          </div>
        </form>
      </div>
    </div>
  );
}
