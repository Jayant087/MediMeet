import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';

const AddDoctor = () => {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    speciality: 'General physician',
    experience: '',
    fees: '',
    about: '',
    degree: '',
    photo: null
  });

  // Redirect if not admin
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        alert('Doctor added successfully!');
        navigate('/admin/doctors');
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to add doctor');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding doctor');
    }
  };

  return (
    <AdminLayout title="Add New Doctor">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => navigate('/admin/doctors')}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to List
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-lg"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Speciality
            </label>
            <select
              required
              className="w-full p-2 border rounded-lg"
              value={formData.speciality}
              onChange={(e) => setFormData({...formData, speciality: e.target.value})}
            >
              <option value="General physician">General physician</option>
              <option value="Pediatrician">Pediatrician</option>
              <option value="Dermatologist">Dermatologist</option>
              <option value="Gynecologist">Gynecologist</option>
              <option value="Neurologist">Neurologist</option>
              <option value="Gastroenterologist">Gastroenterologist</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience (years)
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full p-2 border rounded-lg"
              value={formData.experience}
              onChange={(e) => setFormData({...formData, experience: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Consultation Fees ($)
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full p-2 border rounded-lg"
              value={formData.fees}
              onChange={(e) => setFormData({...formData, fees: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Degree
            </label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded-lg"
              value={formData.degree}
              onChange={(e) => setFormData({...formData, degree: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Profile Photo
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 border rounded-lg"
              onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              About
            </label>
            <textarea
              required
              rows="4"
              className="w-full p-2 border rounded-lg"
              value={formData.about}
              onChange={(e) => setFormData({...formData, about: e.target.value})}
            ></textarea>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Doctor
          </button>
        </div>
      </form>
    </AdminLayout>
  );
};

export default AddDoctor;
