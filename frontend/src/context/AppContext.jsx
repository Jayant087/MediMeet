import { createContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [user, setUser] = useState(null);
  const [doctors, setDoctors] = useState([]);
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
    }
  ];

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
    setUser(null);
  };

  const value = {
    user,
    setUser,
    logout,
    loading,
    doctors,
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
