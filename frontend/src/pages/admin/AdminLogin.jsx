import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in as admin
  useEffect(() => {
    if (user?.isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      // For demo purposes, you can use hardcoded admin credentials
      if (email === 'admin@example.com' && password === 'admin123') {
        const adminUser = {
          id: 'admin1',
          name: 'Admin User',
          email: 'admin@example.com',
          isAdmin: true,
          photo: null
        };
        
        // Simulate token
        localStorage.setItem('token', 'admin-demo-token');
        setUser(adminUser);
        navigate('/admin/dashboard');
        return;
      }

      // If you want to implement real API authentication, uncomment below:
      /*
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/admin-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid credentials');
      }

      if (data.success && data.token && data.user && data.user.isAdmin) {
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/admin/dashboard');
      } else {
        throw new Error('Invalid admin credentials');
      }
      */

      // For now, show error for wrong credentials
      throw new Error('Invalid admin credentials');

    } catch (error) {
      console.error('Admin login error:', error);
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Admin Panel
          </h1>
        </div>

        <form onSubmit={handleAdminLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Doctor Login?{' '}
              <button
                type="button"
                onClick={() => navigate('/doctor/login')}
                className="text-green-600 hover:underline"
              >
                Click here
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
