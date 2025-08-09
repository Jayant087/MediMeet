import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const DoctorLayout = ({ children, title }) => {
  const { user, logout } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationItems = [
    { path: '/doctor/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/doctor/appointments', label: 'Appointments', icon: '�' },
    { path: '/doctor/profile', label: 'Profile', icon: '�' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-green-600 to-green-700 shadow-xl relative">
        {/* Header */}
        <div className="p-6 border-b border-green-500">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-2xl">⚕️</span>
            </div>
          </div>
          <div className="text-center mt-3">
            <h2 className="text-white font-semibold text-lg">Doctor Panel</h2>
            <p className="text-green-100 text-sm">Healthcare Management</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          {navigationItems.map((item) => (
            <div 
              key={item.path}
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer mb-3 transition-all duration-200 ${
                location.pathname === item.path 
                  ? 'bg-white bg-opacity-20 text-white shadow-lg backdrop-blur-sm border border-white border-opacity-30' 
                  : 'text-green-100 hover:bg-white hover:bg-opacity-10 hover:text-white'
              }`}
              onClick={() => navigate(item.path)}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-white bg-opacity-10 rounded-xl p-4 text-center">
            <p className="text-green-100 text-sm">MediMeet v2.0</p>
            <p className="text-green-200 text-xs">Professional Edition</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white shadow-sm border-b px-6 py-3">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            <button 
              onClick={handleLogout}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLayout;
