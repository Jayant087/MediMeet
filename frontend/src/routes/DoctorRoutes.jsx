import { Routes, Route, Navigate } from 'react-router-dom';
import DoctorDashboard from '../pages/doctor/DoctorDashboard';
import DoctorAppointments from '../pages/doctor/DoctorAppointments';
import DoctorProfile from '../pages/doctor/DoctorProfile';
import DoctorLogin from '../pages/doctor/DoctorLogin';

const DoctorRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<DoctorLogin />} />
      <Route path="dashboard" element={<DoctorDashboard />} />
      <Route path="appointments" element={<DoctorAppointments />} />
      <Route path="profile" element={<DoctorProfile />} />
      <Route path="*" element={<Navigate to="/doctor/login" replace />} />
    </Routes>
  );
};

export default DoctorRoutes;
