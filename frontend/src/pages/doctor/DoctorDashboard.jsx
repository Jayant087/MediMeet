import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import DoctorLayout from '../../components/DoctorLayout';

const DoctorDashboard = () => {
  const { user, getDoctorAppointments } = useContext(AppContext);
  const navigate = useNavigate();

  // Redirect if not doctor
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.isDoctor) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  // Get real appointments for this doctor
  const doctorAppointments = getDoctorAppointments(user.id);
  
  // Filter appointments for today
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = doctorAppointments.filter(apt => apt.date === today);

  // Sample appointments data for the doctor (fallback if no real appointments)
  const sampleAppointments = [
    {
      id: 1,
      patientName: 'John Doe',
      time: '10:00 AM',
      status: 'Confirmed',
      type: 'General Checkup'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      time: '11:30 AM',
      status: 'Pending',
      type: 'Follow-up'
    },
    {
      id: 3,
      patientName: 'Mike Wilson',
      time: '2:00 PM',
      status: 'Confirmed',
      type: 'Consultation'
    }
  ];

  // Use real appointments if available, otherwise use sample data
  const displayAppointments = todayAppointments.length > 0 ? todayAppointments : sampleAppointments;

  const stats = [
    {
      title: 'Today Appointments',
      count: todayAppointments.length,
      icon: '📅',
      color: 'bg-blue-100'
    },
    {
      title: 'Total Appointments',
      count: doctorAppointments.length,
      icon: '👥',
      color: 'bg-green-100'
    },
    {
      title: 'Total Earnings',
      count: `$${doctorAppointments.length * (user.fees || 100)}`,
      icon: '💰',
      color: 'bg-purple-100'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DoctorLayout title={`Welcome, ${user.name}`}>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">📋 Today's Appointments</h2>
          </div>
          <div className="p-6">
            {displayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">📅</div>
                <p className="text-gray-500">No appointments today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {displayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {appointment.patientName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">{appointment.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800">{appointment.time}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Doctor Profile Summary */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">👨‍⚕️ Profile Summary</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={assets[user.photo] || assets.profile_pic} 
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover border-3 border-green-200"
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                <p className="text-green-600 font-medium">{user.speciality}</p>
                <p className="text-sm text-gray-500">{user.degree}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Experience:</span>
                <span className="font-medium">{user.experience}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Consultation Fee:</span>
                <span className="font-medium">${user.fees}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Location:</span>
                <span className="font-medium text-right">{user.address?.line1}</span>
              </div>
            </div>

            <button 
              onClick={() => navigate('/doctor/profile')}
              className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorDashboard;
