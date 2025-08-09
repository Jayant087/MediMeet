import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/admin/Dashboard';
import DoctorsList from '../pages/admin/DoctorsList';
import AddDoctor from '../pages/admin/AddDoctor';
import AllAppointments from '../pages/admin/AllAppointments';
import AdminLogin from '../pages/admin/AdminLogin';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="appointments" element={<AllAppointments />} />
      <Route path="doctors" element={<DoctorsList />} />
      <Route path="add-doctor" element={<AddDoctor />} />
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminRoutes;
