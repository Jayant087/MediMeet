import { createContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currencySymbol = '$';

  // Static doctor data
  const staticDoctors = [
    {
      _id: 'doc1',
      name: "Dr. John Smith",
      speciality: "General Physician",
      experience: "8+ years",
      fees: 100,
      about: "Experienced general physician with expertise in primary care and preventive medicine.",
      image: assets.doc1,
      degree: "MBBS, MD",
      address: {
        line1: "123 Medical Street",
        line2: "Healthcare Complex, City Center"
      }
    },
    {
      _id: 'doc2',
      name: "Dr. Sarah Wilson",
      speciality: "Pediatrician",
      experience: "6+ years",
      fees: 120,
      about: "Dedicated pediatrician specializing in child healthcare and development.",
      image: assets.doc2,
      degree: "MBBS, MD Pediatrics",
      address: {
        line1: "456 Children's Lane",
        line2: "Pediatric Center, West Area"
      }
    },
    {
      _id: 'doc3',
      name: "Dr. Michael Brown",
      speciality: "Dermatologist",
      experience: "10+ years",
      fees: 150,
      about: "Expert dermatologist specializing in skin conditions and cosmetic procedures.",
      image: assets.doc3,
      degree: "MBBS, MD Dermatology",
      address: {
        line1: "789 Skin Care Drive",
        line2: "Dermatology Wing, East Hospital"
      }
    },
    {
      _id: 'doc4',
      name: "Dr. Emily Davis",
      speciality: "Gynecologist",
      experience: "12+ years",
      fees: 180,
      about: "Experienced gynecologist specializing in women's health and reproductive care.",
      image: assets.doc4,
      degree: "MBBS, MD Gynecology",
      address: {
        line1: "321 Women's Health Road",
        line2: "Gynecology Center, North Wing"
      }
    },
    {
      _id: 'doc5',
      name: "Dr. Robert Chen",
      speciality: "Neurologist",
      experience: "15+ years",
      fees: 200,
      about: "Expert neurologist specializing in brain and nervous system disorders.",
      image: assets.doc5,
      degree: "MBBS, MD Neurology",
      address: {
        line1: "654 Brain Health Avenue",
        line2: "Neurology Department, South Hospital"
      }
    },
    {
      _id: 'doc6',
      name: "Dr. Lisa Anderson",
      speciality: "Gastroenterologist",
      experience: "9+ years",
      fees: 160,
      about: "Skilled gastroenterologist specializing in digestive system disorders.",
      image: assets.doc6,
      degree: "MBBS, MD Gastroenterology",
      address: {
        line1: "987 Digestive Health Street",
        line2: "Gastro Center, Main Hospital"
      }
    },
    {
      _id: 'doc7',
      name: "Dr. James Wilson",
      speciality: "General physician",
      experience: "7+ years",
      fees: 110,
      about: "Dedicated general physician with focus on family medicine and preventive care.",
      image: assets.doc7,
      degree: "MBBS, MD",
      address: {
        line1: "111 Family Care Street",
        line2: "Primary Health Center, Downtown"
      }
    },
    {
      _id: 'doc8',
      name: "Dr. Maria Garcia",
      speciality: "Pediatricians",
      experience: "11+ years",
      fees: 140,
      about: "Experienced pediatrician specializing in adolescent medicine and child development.",
      image: assets.doc8,
      degree: "MBBS, MD Pediatrics",
      address: {
        line1: "222 Kids Health Avenue",
        line2: "Children's Medical Center, Uptown"
      }
    },
    {
      _id: 'doc9',
      name: "Dr. David Thompson",
      speciality: "Dermatologist",
      experience: "13+ years",
      fees: 170,
      about: "Expert in medical and cosmetic dermatology with advanced treatment techniques.",
      image: assets.doc9,
      degree: "MBBS, MD Dermatology",
      address: {
        line1: "333 Skin Care Boulevard",
        line2: "Advanced Dermatology Clinic, Midtown"
      }
    },
    {
      _id: 'doc10',
      name: "Dr. Rachel Lee",
      speciality: "Gynecologist",
      experience: "14+ years",
      fees: 190,
      about: "Specialist in women's reproductive health and minimally invasive gynecological procedures.",
      image: assets.doc10,
      degree: "MBBS, MD Gynecology",
      address: {
        line1: "444 Women's Health Drive",
        line2: "Reproductive Health Center, East Side"
      }
    },
    {
      _id: 'doc11',
      name: "Dr. Kevin Miller",
      speciality: "Neurologist",
      experience: "16+ years",
      fees: 220,
      about: "Leading neurologist specializing in stroke care and neurodegenerative diseases.",
      image: assets.doc11,
      degree: "MBBS, MD Neurology",
      address: {
        line1: "555 Brain Research Lane",
        line2: "Neuroscience Institute, Medical District"
      }
    },
    {
      _id: 'doc12',
      name: "Dr. Amanda Taylor",
      speciality: "Gastroenterologist",
      experience: "10+ years",
      fees: 175,
      about: "Expert in inflammatory bowel diseases and advanced endoscopic procedures.",
      image: assets.doc12,
      degree: "MBBS, MD Gastroenterology",
      address: {
        line1: "666 Digestive Care Road",
        line2: "GI Specialists Center, West Wing"
      }
    },
    {
      _id: 'doc13',
      name: "Dr. Christopher Brown",
      speciality: "General physician",
      experience: "5+ years",
      fees: 90,
      about: "Young and enthusiastic family doctor focused on comprehensive primary care.",
      image: assets.doc13,
      degree: "MBBS",
      address: {
        line1: "777 Community Health Street",
        line2: "Family Medicine Clinic, Suburbs"
      }
    },
    {
      _id: 'doc14',
      name: "Dr. Jennifer Davis",
      speciality: "Pediatricians",
      experience: "8+ years",
      fees: 125,
      about: "Caring pediatrician with expertise in newborn care and childhood immunizations.",
      image: assets.doc14,
      degree: "MBBS, MD Pediatrics",
      address: {
        line1: "888 Little Ones Avenue",
        line2: "Pediatric Care Center, North Side"
      }
    },
    {
      _id: 'doc15',
      name: "Dr. Thomas Anderson",
      speciality: "Dermatologist",
      experience: "12+ years",
      fees: 165,
      about: "Dermatologist specializing in skin cancer detection and laser treatments.",
      image: assets.doc15,
      degree: "MBBS, MD Dermatology",
      address: {
        line1: "999 Derma Solutions Drive",
        line2: "Skin Health Institute, South Campus"
      }
    }
  ];

  // Demo patients for testing
  const demoPatients = [
    {
      id: 'patient1',
      name: 'John Doe',
      email: 'john@demo.com',
      password: 'demo123',
      phone: '+1234567890',
      address: '123 Patient Street, City',
      gender: 'Male',
      dob: '1990-05-15'
    },
    {
      id: 'patient2', 
      name: 'Jane Smith',
      email: 'jane@demo.com',
      password: 'demo123',
      phone: '+1987654321',
      address: '456 Patient Avenue, City',
      gender: 'Female',
      dob: '1985-12-10'
    },
    {
      id: 'patient3',
      name: 'Mike Johnson',
      email: 'mike@demo.com', 
      password: 'demo123',
      phone: '+1122334455',
      address: '789 Patient Road, City',
      gender: 'Male',
      dob: '1992-08-20'
    }
  ];

  // Load appointments from localStorage on mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  }, []);

  // Function to book an appointment with static doctors
  const bookAppointment = (appointmentData) => {
    const newAppointment = {
      id: Date.now().toString(),
      patientId: user?.id,
      patientName: user?.name,
      patientEmail: user?.email,
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.doctorName,
      date: appointmentData.date,
      time: appointmentData.time,
      status: 'Confirmed',
      type: appointmentData.type || 'General Consultation',
      createdAt: new Date().toISOString()
    };

    const updatedAppointments = [...appointments, newAppointment];
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    return newAppointment;
  };

  // Function to get appointments for a specific doctor
  const getDoctorAppointments = (doctorId) => {
    return appointments.filter(apt => apt.doctorId === doctorId);
  };

  // Function to get appointments for a specific patient
  const getPatientAppointments = (patientId) => {
    return appointments.filter(apt => apt.patientId === patientId);
  };

  // Function to update appointment status
  const updateAppointmentStatus = (appointmentId, newStatus) => {
    const updatedAppointments = appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    );
    setAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
  };

  // Patient login function
  const loginPatient = (email, password) => {
    const patient = demoPatients.find(p => p.email === email && p.password === password);
    if (patient) {
      const patientUser = {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        phone: patient.phone,
        address: patient.address,
        gender: patient.gender,
        dob: patient.dob,
        role: 'patient'
      };
      setUser(patientUser);
      localStorage.setItem('user', JSON.stringify(patientUser));
      return { success: true, user: patientUser };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  // Fetch doctors from backend
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.length > 0) {
            // If we got data from the API, use it
            setDoctors(data);
          } else {
            // If no data from API, use static data
            console.log('Using static doctor data');
            setDoctors(staticDoctors);
          }
        } else {
          // If API call failed, use static data
          console.log('API call failed, using static doctor data');
          setDoctors(staticDoctors);
        }
      } catch (error) {
        console.error('Failed to fetch doctors:', error);
        // On error, use static data
        console.log('Error occurred, using static doctor data');
        setDoctors(staticDoctors);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    // Check if user is logged in on mount
    const checkAuth = async () => {
      // First check for user in localStorage (for demo patients)
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('user');
        }
      }

      // Check for API token
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data) {
              setUser(data);
            } else {
              console.error('No user data received');
              localStorage.removeItem('token');
            }
          } else {
            console.error('Failed to fetch user data:', await response.text());
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    logout,
    loading,
    doctors,
    appointments,
    bookAppointment,
    getDoctorAppointments,
    getPatientAppointments,
    updateAppointmentStatus,
    loginPatient,
    currencySymbol
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
