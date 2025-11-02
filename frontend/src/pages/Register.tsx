import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'enter' | 'code-sent'>('enter');
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setErr('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setErr('Password must be at least 6 characters long');
      return;
    }

    // Gmail validation
    if (!formData.email.toLowerCase().endsWith('@gmail.com')) {
      setErr('Please use a Gmail address');
      return;
    }

    // Password complexity validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setErr('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
      return;
    }

    try {
      // Send verification code to email
      await api.post('/auth/send-code', { email: formData.email });
      setStep('code-sent');
      setErr('Verification code sent to your Gmail. Please check and enter it below.');
    } catch (err: any) {
      setErr(err?.response?.data?.message || err.message || 'Registration failed');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      await api.post('/auth/register-verify', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        code,
      });
      navigate('/login');
    } catch (err: any) {
      setErr(err?.response?.data?.message || err.message || 'Verification failed');
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
          <p className="text-blue-600 text-2xl mt-1">Create your account</p>
        </h2>
        
  <form onSubmit={step === 'enter' ? handleSubmit : handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">FULL NAME</label>
            <input 
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="TYPE YOUR NAME"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">EMAIL</label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@example.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">PASSWORD</label>
            <input 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="• • • • • • • •"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 block">RE-TYPE PASSWORD</label>
            <input 
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="• • • • • • • •"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
              required 
            />
          </div>

          {step === 'code-sent' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">VERIFICATION CODE</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors duration-200"
                required
              />
            </div>
          )}

          {err && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
              {err}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-200"
          >
            {step === 'enter' ? 'SEND VERIFICATION CODE' : 'VERIFY & CREATE ACCOUNT'}
          </button>

          {step === 'code-sent' && (
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await api.post('/auth/send-code', { email: formData.email });
                    setErr('Verification code resent');
                  } catch (err: any) {
                    setErr(err?.response?.data?.message || err.message || 'Resend failed');
                  }
                }}
                className="text-sm text-gray-600 hover:text-blue-500"
              >
                Resend code
              </button>
            </div>
          )}

          <div className="text-center">
            <span className="text-sm text-gray-600">ALREADY HAVE AN ACCOUNT? </span>
            <a href="/login" className="text-sm text-green-600 hover:text-green-700">LOGIN</a>
          </div>
        </form>
      </div>
    </div>
  );
}
