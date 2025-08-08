import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from '../assets/assets';
import { AppContext } from "../context/AppContext";
import { getImageUrl } from "../utils/helpers";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [userData, setUserData] = useState({
    name: "",
    image: assets.profile_pic,
    email: "",
    phone: "",
    address: {
      line1: "",
      line2: ""
    },
    gender: "Male",
    dob: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        setUploadLoading(true);
        setError("");
        
        // Show immediate preview
        const imageUrl = URL.createObjectURL(file);
        setUserData(prev => ({
          ...prev,
          image: imageUrl
        }));
        
        // Upload the file immediately
        await uploadImage(file);
        
        // Cleanup the temporary object URL
        URL.revokeObjectURL(imageUrl);
        
      } catch (err) {
        setError("Failed to upload image: " + err.message);
        // Revert to previous image on error
        setUserData(prev => ({
          ...prev,
          image: getImageUrl(user?.photo) || assets.profile_pic
        }));
      } finally {
        setUploadLoading(false);
      }
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile/photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        // Update global user state with the new user data
        setUser(data.user);
      }
      
      return data.photoUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Initialize form with user data
    setUserData({
      name: user.name || "",
      image: getImageUrl(user.photo) || assets.profile_pic,
      email: user.email || "",
      phone: user.phoneNumber || "",
      address: {
        line1: user.address?.street || "",
        line2: `${user.address?.city || ""}, ${user.address?.state || ""}`
      },
      gender: user.gender || "Male",
      dob: user.dateOfBirth || "",
    });
  }, [user, navigate]);

  const [isEdit,setIsEdit] = useState(false)

  return <div className="max-w-lg flex flex-col gap-2 text-sm">
    <div className="relative">
      <img 
        className="w-36 h-36 rounded-full object-cover" 
        src={userData.image} 
        alt=""
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = assets.profile_pic;
        }}
      />
      {isEdit && (
        <div className="absolute bottom-0 right-0">
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={uploadLoading}
          />
          <label
            htmlFor="photo-upload"
            className={`bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 inline-block ${
              uploadLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {uploadLoading ? (
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            )}
          </label>
        </div>
      )}
      {error && (
        <div className="absolute -bottom-6 right-0 left-0 text-red-500 text-xs bg-red-50 p-1 rounded">
          {error}
        </div>
      )}
    </div>
    {
      isEdit
      ? <input 
          className="bg-gray-50 text-3xl font-medium max-w-60 mt-4 p-1 rounded" 
          type="text" 
          value={userData.name} 
          onChange={e => setUserData(prev => ({...prev, name: e.target.value}))}
        />
      : <p className="font-medium text-3xl text-neutral-800 mt-4">{userData.name}</p>
    }
    <hr className="bg-zinc-400 h-[1px] border-none"/>
    <div>
      <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
      <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
        <p className="font-medium">Email id:</p>
        <p className="text-blue-500">{userData.email}</p>
        <p className="font-medium">Phone:</p>
        {
          isEdit
          ? <input 
              className="bg-gray-100 max-w-52 p-1 rounded" 
              type="text" 
              value={userData.phone} 
              onChange={e => setUserData(prev => ({...prev, phone: e.target.value}))}
            />
          : <p className="text-blue-400">{userData.phone || 'Not provided'}</p>
        }
        <p className="font-medium">Address:</p>
        {
          isEdit
          ? <div className="space-y-2">
              <input 
                className="bg-gray-100 w-full p-1 rounded" 
                placeholder="Street address"
                onChange={(e) => setUserData(prev => ({ 
                  ...prev, 
                  address: {...prev.address, line1: e.target.value}
                }))} 
                value={userData.address.line1} 
                type="text" 
              />
              <input 
                className="bg-gray-100 w-full p-1 rounded" 
                placeholder="City, State"
                onChange={(e) => setUserData(prev => ({ 
                  ...prev, 
                  address: {...prev.address, line2: e.target.value}
                }))} 
                value={userData.address.line2}  
                type="text" 
              />
            </div>
          : <p className="text-gray-500">
              {userData.address.line1 || 'Address not provided'}
              {userData.address.line1 && userData.address.line2 && <br/>}
              {userData.address.line2}
            </p>
        }
      </div>
    </div>

    <div>
      <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
      <div className="grid grid-cols-[1fr_3fr] gap-y-2.5 mt-3 text-neutral-700">
        <p className="font-medium">Gender:</p>
        {
      isEdit
      ? <select className="max-w-20 bg-gray-100" onChange={(e) => setUserData(prev => ({...prev, gender: e.target.value}))} value={userData.gender}>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
      : <p className="text-gray-400">{userData.gender}</p>
    }

    <p className="font-medium">Birthday:</p>
    {
      isEdit
      ? <input className="max-w-28 bg-gray-100" type="date" onChange={(e) => setUserData(prev => ({...prev, dob: e.target.value}))} value={userData.dob}/>
      : <p className="text-gray-400">{userData.dob}</p>
    }
      </div>
    </div>
    <div className="mt-10">
      {error && (
        <div className="mb-4 p-3 text-red-500 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      {
        isEdit
        ? (
          <button 
            className={`border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={async () => {
              try {
                setLoading(true);
                setError("");

                const token = localStorage.getItem('token');
                // Split city and state
                const [city, state] = userData.address.line2.split(',').map(s => s.trim());
                
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/profile`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    name: userData.name,
                    phoneNumber: userData.phone,
                    address: {
                      street: userData.address.line1,
                      city,
                      state
                    },
                    gender: userData.gender,
                    dateOfBirth: userData.dob
                  })
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.message || 'Failed to update profile');
                }

                // Update global user state
                setUser(data.data);
                setIsEdit(false);
              } catch (err) {
                setError(err.message || 'Failed to update profile');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save information'}
          </button>
        )
        : <button 
            className="border border-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all" 
            onClick={() => setIsEdit(true)}
          >
            Edit
          </button>
      }
    </div>
  </div>;
};

export default MyProfile;
