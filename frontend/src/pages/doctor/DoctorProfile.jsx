import React, { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import DoctorLayout from '../../components/DoctorLayout';

const DoctorProfile = () => {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  // Redirect if not doctor
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (!user.isDoctor) {
      navigate('/');
    }
  }, [user, navigate]);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    speciality: user?.speciality || '',
    degree: user?.degree || '',
    experience: user?.experience || '',
    about: user?.about || '',
    fees: user?.fees || '',
    photo: user?.photo || '',
    address: {
      line1: user?.address?.line1 || '',
      line2: user?.address?.line2 || ''
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = () => {
    // Update user data
    const updatedUser = {
      ...user,
      ...formData
    };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      speciality: user?.speciality || '',
      degree: user?.degree || '',
      experience: user?.experience || '',
      about: user?.about || '',
      fees: user?.fees || '',
      photo: user?.photo || '',
      address: {
        line1: user?.address?.line1 || '',
        line2: user?.address?.line2 || ''
      }
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <DoctorLayout title="My Profile">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">👨‍⚕️ Doctor Profile</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture Section */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <img 
                    src={assets[user.photo] || assets.profile_pic} 
                    alt={user.name}
                    className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-green-100"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-green-600 font-medium">{user.speciality}</p>
                  <p className="text-gray-500 text-sm mt-1">{user.degree}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Experience:</span> {user.experience}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Consultation Fee:</span> ${user.fees}
                    </p>
                  </div>
                  {!isEditing && (
                    <button className="mt-3 text-sm text-green-600 hover:underline">
                      Change Photo
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Information */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg">{user.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Speciality
                    </label>
                    {isEditing ? (
                      <select
                        name="speciality"
                        value={formData.speciality}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      >
                        <option value="General physician">General physician</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="Pediatricians">Pediatricians</option>
                        <option value="Neurologist">Neurologist</option>
                        <option value="Gastroenterologist">Gastroenterologist</option>
                      </select>
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg">{user.speciality}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Degree
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="degree"
                        value={formData.degree}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg">{user.degree}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="experience"
                        value={formData.experience}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg">{user.experience}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Consultation Fee
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        name="fees"
                        value={formData.fees}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg">${user.fees}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    About
                  </label>
                  {isEditing ? (
                    <textarea
                      name="about"
                      value={formData.about}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  ) : (
                    <p className="px-3 py-2 bg-gray-50 rounded-lg">{user.about}</p>
                  )}
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 1
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.line1"
                        value={formData.address.line1}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg">{user.address?.line1}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address Line 2
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address.line2"
                        value={formData.address.line2}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                      />
                    ) : (
                      <p className="px-3 py-2 bg-gray-50 rounded-lg">{user.address?.line2}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Doctor Information */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Professional Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Doctor ID:</span> {user._id || user.id}</p>
                  <p><span className="font-medium">Specialization:</span> {user.speciality}</p>
                  <p><span className="font-medium">Medical Degree:</span> {user.degree}</p>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Practice Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Years of Experience:</span> {user.experience}</p>
                  <p><span className="font-medium">Consultation Fee:</span> ${user.fees}</p>
                  <p><span className="font-medium">Status:</span> <span className="text-green-600">Active</span></p>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Email:</span> {user.email}</p>
                  <p><span className="font-medium">Clinic Address:</span></p>
                  <p className="text-gray-600">{user.address?.line1}</p>
                  <p className="text-gray-600">{user.address?.line2}</p>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-6 bg-gray-50 p-6 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">About Dr. {user.name?.split(' ')[1] || user.name}</h4>
              <p className="text-gray-600 leading-relaxed">{user.about}</p>
            </div>
          </div>
        </div>
      </div>
    </DoctorLayout>
  );
};

export default DoctorProfile;
