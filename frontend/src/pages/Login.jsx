import React, { useState, useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser, loginPatient } = useContext(AppContext);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [state, setState] = useState('Sign Up');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (state === 'Sign Up') {
        // For demo purposes, create a new patient account
        const newPatient = {
          id: 'patient_' + Date.now(),
          name: name,
          email: email,
          phone: '+1234567890',
          address: '123 Demo Street, Demo City',
          gender: 'Not specified',
          dob: '1990-01-01',
          role: 'patient'
        };
        setUser(newPatient);
        localStorage.setItem('user', JSON.stringify(newPatient));
        navigate('/');
      } else {
        // Try demo login first
        const result = loginPatient(email, password);
        if (result.success) {
          navigate('/');
        } else {
          // If demo login fails, try API login
          const endpoint = '/api/auth/login';
          const payload = { email, password };

          const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.message || 'Invalid credentials. Try demo credentials: john@demo.com / demo123');
          }

          if (data.success && data.token && data.user) {
            localStorage.setItem('token', data.token);
            setUser(data.user);
            navigate('/');
          } else {
            throw new Error(data.message || 'Invalid response from server');
          }
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center">
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">{state === 'Sign Up' ? "Create Account" : "Login"}</p>
        <p>Please {state === 'Sign Up' ? "sign up" : "log in"} to book appointment</p>
        
        {state === 'Login' && (
          <div className="w-full p-3 bg-blue-50 rounded-md text-sm">
            <p className="font-medium text-blue-800 mb-1">Demo Credentials:</p>
            <p className="text-blue-700">Email: john@demo.com</p>
            <p className="text-blue-700">Password: demo123</p>
            <p className="text-blue-600 text-xs mt-1">Or try: jane@demo.com, mike@demo.com</p>
          </div>
        )}
        
        {error && (
          <div className="w-full p-3 text-red-500 bg-red-50 rounded-md text-sm">
            {error}
          </div>
        )}

        {state === 'Sign Up' && (
          <div className="w-full">
            <p>Full Name</p>
            <input 
              className="border border-zinc-300 rounded w-full p-2 mt-1" 
              type="text" 
              onChange={(e) => setName(e.target.value)} 
              value={name} 
              required
            />
          </div>
        )}
        
        <div className="w-full">
          <p>Email</p>
          <input 
            className="border border-zinc-300 rounded w-full p-2 mt-1" 
            type="email" 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            required
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input 
            className="border border-zinc-300 rounded w-full p-2 mt-1" 
            type="password" 
            onChange={(e) => setPassword(e.target.value)} 
            value={password} 
            required
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className={`bg-primary text-white w-full py-2 rounded-md text-base ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Loading...' : state === 'Sign Up' ? "Create Account" : "Login"}
        </button>
        
        {state === "Sign Up" ? (
          <p>Already have an account? <span onClick={() => setState('Login')} className="text-primary underline cursor-pointer">Login here</span></p>
        ) : (
          <p>Create a new account? <span onClick={() => setState('Sign Up')} className="text-primary underline cursor-pointer">Click here</span></p>
        )}
      </div>
    </form>
  );
};

export default Login;
