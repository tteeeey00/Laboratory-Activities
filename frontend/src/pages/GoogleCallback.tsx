import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the token from the URL (it will be in the query parameters)
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        
        if (!token) {
          console.error('No token received');
          navigate('/login');
          return;
        }

        // Store the token and user info
        localStorage.setItem('token', token);

        // Get user info from token payload
        const payload = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('userEmail', payload.email);
        localStorage.setItem('userName', payload.email.split('@')[0]);

        // Redirect to dashboard
        navigate('/');
      } catch (error) {
        console.error('Google callback error:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}