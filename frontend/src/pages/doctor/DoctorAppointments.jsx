import React, { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import DoctorLayout from '../../components/DoctorLayout';

const DoctorAppointments = () => {
  const { user, getDoctorAppointments, updateAppointmentStatus } = useContext(AppContext);
  const navigate = useNavigate();

  // Redirect if not doctor
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.isDoctor) {
      navigate('/');
    }
  }, [user, navigate]);

  // Get real appointments for this doctor
  const doctorAppointments = getDoctorAppointments(user?.id || '');

  // Sample appointment data for the doctor (fallback)
  const sampleAppointments = [
    {
      id: 1,
      patientName: 'John Doe',
      date: '2024-08-10',
      time: '10:00 AM',
      status: 'Confirmed',
      type: 'General Checkup',
      patientAge: 35,
      patientPhone: '+1 234 567 8901'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      date: '2024-08-10',
      time: '11:30 AM',
      status: 'Pending',
      type: 'Follow-up',
      patientAge: 28,
      patientPhone: '+1 234 567 8902'
    },
    {
      id: 3,
      patientName: 'Mike Wilson',
      date: '2024-08-11',
      time: '2:00 PM',
      status: 'Confirmed',
      type: 'Consultation',
      patientAge: 42,
      patientPhone: '+1 234 567 8903'
    },
    {
      id: 4,
      patientName: 'Lisa Brown',
      date: '2024-08-11',
      time: '3:30 PM',
      status: 'Completed',
      type: 'Regular Checkup',
      patientAge: 31,
      patientPhone: '+1 234 567 8904'
    },
    {
      id: 5,
      patientName: 'David Miller',
      date: '2024-08-12',
      time: '9:00 AM',
      status: 'Confirmed',
      type: 'Consultation',
      patientAge: 55,
      patientPhone: '+1 234 567 8905'
    }
  ];

  // Use real appointments if available, otherwise use sample data
  const appointments = doctorAppointments.length > 0 ? doctorAppointments : sampleAppointments;

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCompleteAppointment = (appointmentId) => {
    console.log('Completing appointment:', appointmentId);
    updateAppointmentStatus(appointmentId, 'Completed');
  };

  const handleCancelAppointment = (appointmentId) => {
    console.log('Cancelling appointment:', appointmentId);
    updateAppointmentStatus(appointmentId, 'Cancelled');
  };

  return (
    <DoctorLayout title="My Appointments">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">📅 Appointment Management</h2>
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
              <p className="text-gray-500">Your patient appointments will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Patient</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Date & Time</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Contact</th>
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
                            <p className="text-sm text-gray-500">{appointment.patientEmail || 'N/A'}</p>
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
                        <p className="text-gray-900">{appointment.type}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">{appointment.patientEmail || 'N/A'}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          {appointment.status === 'Confirmed' && (
                            <button
                              onClick={() => handleCompleteAppointment(appointment.id)}
                              className="text-green-600 hover:text-green-800 text-sm font-medium"
                            >
                              Complete
                            </button>
                          )}
                          {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Cancel
                            </button>
                          )}
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            View Details
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
    </DoctorLayout>
  );
};

export default DoctorAppointments;
