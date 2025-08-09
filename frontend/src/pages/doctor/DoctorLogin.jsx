import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

const DoctorLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleDoctorLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Get all doctors from context to find matching doctor
      const allDoctors = [
        { id: 'doc1', email: 'john.smith@hospital.com', password: 'doctor123', doctorData: { _id: 'doc1', name: "Dr. John Smith", speciality: "General physician", degree: "MBBS, MD", experience: "8+ years", about: "Experienced general physician with expertise in primary care and preventive medicine.", fees: 100, address: { line1: "123 Medical Street", line2: "Healthcare Complex, City Center" }, photo: 'doc1' }},
        { id: 'doc2', email: 'sarah.wilson@hospital.com', password: 'doctor123', doctorData: { _id: 'doc2', name: "Dr. Sarah Wilson", speciality: "Pediatricians", degree: "MBBS, MD Pediatrics", experience: "6+ years", about: "Dedicated pediatrician specializing in child healthcare and development.", fees: 120, address: { line1: "456 Children's Lane", line2: "Pediatric Center, West Area" }, photo: 'doc2' }},
        { id: 'doc3', email: 'michael.brown@hospital.com', password: 'doctor123', doctorData: { _id: 'doc3', name: "Dr. Michael Brown", speciality: "Dermatologist", degree: "MBBS, MD Dermatology", experience: "10+ years", about: "Expert dermatologist specializing in skin conditions and cosmetic procedures.", fees: 150, address: { line1: "789 Skin Care Drive", line2: "Dermatology Wing, East Hospital" }, photo: 'doc3' }},
        { id: 'doc4', email: 'emily.davis@hospital.com', password: 'doctor123', doctorData: { _id: 'doc4', name: "Dr. Emily Davis", speciality: "Gynecologist", degree: "MBBS, MD Gynecology", experience: "12+ years", about: "Experienced gynecologist specializing in women's health and reproductive care.", fees: 180, address: { line1: "321 Women's Health Road", line2: "Gynecology Center, North Wing" }, photo: 'doc4' }},
        { id: 'doc5', email: 'robert.chen@hospital.com', password: 'doctor123', doctorData: { _id: 'doc5', name: "Dr. Robert Chen", speciality: "Neurologist", degree: "MBBS, MD Neurology", experience: "15+ years", about: "Expert neurologist specializing in brain and nervous system disorders.", fees: 200, address: { line1: "654 Brain Health Avenue", line2: "Neurology Department, South Hospital" }, photo: 'doc5' }},
        { id: 'doc6', email: 'lisa.anderson@hospital.com', password: 'doctor123', doctorData: { _id: 'doc6', name: "Dr. Lisa Anderson", speciality: "Gastroenterologist", degree: "MBBS, MD Gastroenterology", experience: "9+ years", about: "Skilled gastroenterologist specializing in digestive system disorders.", fees: 160, address: { line1: "987 Digestive Health Street", line2: "Gastro Center, Main Hospital" }, photo: 'doc6' }},
        { id: 'doc7', email: 'james.wilson@hospital.com', password: 'doctor123', doctorData: { _id: 'doc7', name: "Dr. James Wilson", speciality: "General physician", degree: "MBBS, MD", experience: "7+ years", about: "Dedicated general physician with focus on family medicine and preventive care.", fees: 110, address: { line1: "111 Family Care Street", line2: "Primary Health Center, Downtown" }, photo: 'doc7' }},
        { id: 'doc8', email: 'maria.garcia@hospital.com', password: 'doctor123', doctorData: { _id: 'doc8', name: "Dr. Maria Garcia", speciality: "Pediatricians", degree: "MBBS, MD Pediatrics", experience: "11+ years", about: "Experienced pediatrician specializing in adolescent medicine and child development.", fees: 140, address: { line1: "222 Kids Health Avenue", line2: "Children's Medical Center, Uptown" }, photo: 'doc8' }},
        { id: 'doc9', email: 'david.thompson@hospital.com', password: 'doctor123', doctorData: { _id: 'doc9', name: "Dr. David Thompson", speciality: "Dermatologist", degree: "MBBS, MD Dermatology", experience: "13+ years", about: "Expert in medical and cosmetic dermatology with advanced treatment techniques.", fees: 170, address: { line1: "333 Skin Care Boulevard", line2: "Advanced Dermatology Clinic, Midtown" }, photo: 'doc9' }},
        { id: 'doc10', email: 'rachel.lee@hospital.com', password: 'doctor123', doctorData: { _id: 'doc10', name: "Dr. Rachel Lee", speciality: "Gynecologist", degree: "MBBS, MD Gynecology", experience: "14+ years", about: "Specialist in women's reproductive health and minimally invasive gynecological procedures.", fees: 190, address: { line1: "444 Women's Health Drive", line2: "Reproductive Health Center, East Side" }, photo: 'doc10' }},
        { id: 'doc11', email: 'kevin.miller@hospital.com', password: 'doctor123', doctorData: { _id: 'doc11', name: "Dr. Kevin Miller", speciality: "Neurologist", degree: "MBBS, MD Neurology", experience: "16+ years", about: "Leading neurologist specializing in stroke care and neurodegenerative diseases.", fees: 220, address: { line1: "555 Brain Research Lane", line2: "Neuroscience Institute, Medical District" }, photo: 'doc11' }},
        { id: 'doc12', email: 'amanda.taylor@hospital.com', password: 'doctor123', doctorData: { _id: 'doc12', name: "Dr. Amanda Taylor", speciality: "Gastroenterologist", degree: "MBBS, MD Gastroenterology", experience: "10+ years", about: "Expert in inflammatory bowel diseases and advanced endoscopic procedures.", fees: 175, address: { line1: "666 Digestive Care Road", line2: "GI Specialists Center, West Wing" }, photo: 'doc12' }},
        { id: 'doc13', email: 'christopher.brown@hospital.com', password: 'doctor123', doctorData: { _id: 'doc13', name: "Dr. Christopher Brown", speciality: "General physician", degree: "MBBS", experience: "5+ years", about: "Young and enthusiastic family doctor focused on comprehensive primary care.", fees: 90, address: { line1: "777 Community Health Street", line2: "Family Medicine Clinic, Suburbs" }, photo: 'doc13' }},
        { id: 'doc14', email: 'jennifer.davis@hospital.com', password: 'doctor123', doctorData: { _id: 'doc14', name: "Dr. Jennifer Davis", speciality: "Pediatricians", degree: "MBBS, MD Pediatrics", experience: "8+ years", about: "Caring pediatrician with expertise in newborn care and childhood immunizations.", fees: 125, address: { line1: "888 Little Ones Avenue", line2: "Pediatric Care Center, North Side" }, photo: 'doc14' }},
        { id: 'doc15', email: 'thomas.anderson@hospital.com', password: 'doctor123', doctorData: { _id: 'doc15', name: "Dr. Thomas Anderson", speciality: "Dermatologist", degree: "MBBS, MD Dermatology", experience: "12+ years", about: "Dermatologist specializing in skin cancer detection and laser treatments.", fees: 165, address: { line1: "999 Derma Solutions Drive", line2: "Skin Health Institute, South Campus" }, photo: 'doc15' }},
      ];

      const doctor = allDoctors.find(doc => doc.email === email && doc.password === password);
      
      if (doctor) {
        const doctorUser = {
          ...doctor.doctorData,
          id: doctor.id,
          email: doctor.email,
          isDoctor: true
        };
        
        setUser(doctorUser);
        localStorage.setItem('user', JSON.stringify(doctorUser));
        navigate('/doctor/dashboard');
      } else {
        setError('Invalid doctor credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            Doctor Panel
          </h1>
        </div>

        <form onSubmit={handleDoctorLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="john.smith@hospital.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Admin Login?{' '}
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="text-blue-600 hover:underline"
              >
                Click here
              </button>
            </p>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 font-medium mb-2">Demo Doctor Accounts (All use password: doctor123):</p>
            <div className="text-xs text-gray-500 space-y-1 max-h-32 overflow-y-auto">
              <p>• john.smith@hospital.com - Dr. John Smith (General physician)</p>
              <p>• sarah.wilson@hospital.com - Dr. Sarah Wilson (Pediatrician)</p>
              <p>• michael.brown@hospital.com - Dr. Michael Brown (Dermatologist)</p>
              <p>• emily.davis@hospital.com - Dr. Emily Davis (Gynecologist)</p>
              <p>• robert.chen@hospital.com - Dr. Robert Chen (Neurologist)</p>
              <p>• lisa.anderson@hospital.com - Dr. Lisa Anderson (Gastroenterologist)</p>
              <p>• james.wilson@hospital.com - Dr. James Wilson (General physician)</p>
              <p>• maria.garcia@hospital.com - Dr. Maria Garcia (Pediatrician)</p>
              <p>• david.thompson@hospital.com - Dr. David Thompson (Dermatologist)</p>
              <p>• rachel.lee@hospital.com - Dr. Rachel Lee (Gynecologist)</p>
              <p>• kevin.miller@hospital.com - Dr. Kevin Miller (Neurologist)</p>
              <p>• amanda.taylor@hospital.com - Dr. Amanda Taylor (Gastroenterologist)</p>
              <p>• christopher.brown@hospital.com - Dr. Christopher Brown (General physician)</p>
              <p>• jennifer.davis@hospital.com - Dr. Jennifer Davis (Pediatrician)</p>
              <p>• thomas.anderson@hospital.com - Dr. Thomas Anderson (Dermatologist)</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorLogin;
