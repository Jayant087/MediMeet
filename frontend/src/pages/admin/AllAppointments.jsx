import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import AdminLayout from '../../components/AdminLayout';

const AllAppointments = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();

  // Redirect if not admin
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  // Sample appointment data - replace with actual data from your backend
  const appointments = [
    {
      id: 1,
      patientName: 'John Doe',
      doctorName: 'Dr. Richard James',
      date: '2024-08-10',
      time: '10:00 AM',
      status: 'Confirmed',
      doctorImage: assets.doc1
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      doctorName: 'Dr. Emily Johnson',
      date: '2024-08-10',
      time: '11:30 AM',
      status: 'Pending',
      doctorImage: assets.doc2
    },
    {
      id: 3,
      patientName: 'Mike Wilson',
      doctorName: 'Dr. Sarah Davis',
      date: '2024-08-11',
      time: '2:00 PM',
      status: 'Confirmed',
      doctorImage: assets.doc3
    },
    {
      id: 4,
      patientName: 'Lisa Brown',
      doctorName: 'Dr. Michael Chen',
      date: '2024-08-11',
      time: '3:30 PM',
      status: 'Cancelled',
      doctorImage: assets.doc4
    },
    {
      id: 5,
      patientName: 'David Miller',
      doctorName: 'Dr. Jennifer Lee',
      date: '2024-08-12',
      time: '9:00 AM',
      status: 'Confirmed',
      doctorImage: assets.doc5
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

  const handleCancelAppointment = (appointmentId) => {
    // Handle appointment cancellation
    console.log('Cancelling appointment:', appointmentId);
    // You can add your cancellation logic here
  };

  return (
    <AdminLayout title="All Appointments">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">📅 Appointments Management</h2>
            <div className="text-sm text-gray-500">
              Total: {appointments.length} appointments
            </div>
          </div>
        </div>

        <div className="p-6">
          {appointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500">Appointments will appear here when patients book with doctors.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Doctor</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date & Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {appointment.patientName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{appointment.patientName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={appointment.doctorImage} 
                            alt={appointment.doctorName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{appointment.doctorName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{appointment.date}</p>
                          <p className="text-sm text-gray-500">{appointment.time}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          {appointment.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Cancel
                            </button>
                          )}
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AllAppointments;
