import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import AdminLayout from '../../components/AdminLayout';

const Dashboard = () => {
  const { user, doctors } = useContext(AppContext);
  const navigate = useNavigate();

  // Redirect if not admin
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const stats = [
    {
      title: 'Doctors',
      count: doctors.length,
      icon: '👨‍⚕️',
      color: 'bg-blue-100'
    },
    {
      title: 'Appointments',
      count: 2,
      icon: '📅',
      color: 'bg-green-100'
    },
    {
      title: 'Patients',
      count: 5,
      icon: '👥',
      color: 'bg-purple-100'
    }
  ];

  return (
    <AdminLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.color} p-6 rounded-lg`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-800">{stat.count}</p>
                <p className="text-gray-600 mt-1">{stat.title}</p>
              </div>
              <div className="text-3xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Latest Appointments */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-800">📋 Latest Appointment</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Array(5).fill().map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <img 
                    src={assets.profile_pic} 
                    alt="" 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-800">Dr. Richard James</p>
                    <p className="text-sm text-gray-500">Booking on 24th July, 2024</p>
                  </div>
                </div>
                <button className="text-red-500 hover:text-red-700 text-lg">
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
