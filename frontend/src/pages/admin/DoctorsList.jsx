import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import AdminLayout from '../../components/AdminLayout';

const DoctorsList = () => {
  const { user, doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Redirect if not admin
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.speciality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout title="Doctors List">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search doctors..."
            className="px-4 py-2 border rounded-lg flex-grow sm:flex-grow-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={() => navigate('/admin/add-doctor')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Doctor
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Doctor</th>
                <th className="text-left p-4">Speciality</th>
                <th className="text-left p-4">Experience</th>
                <th className="text-left p-4">Fees</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doctor, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={doctor.image || assets.profile_pic} 
                        alt="" 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span>{doctor.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{doctor.speciality}</td>
                  <td className="p-4">{doctor.experience}</td>
                  <td className="p-4">${doctor.fees}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => navigate(`/admin/edit-doctor/${doctor._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ✎
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default DoctorsList;
