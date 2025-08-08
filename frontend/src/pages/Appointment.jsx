import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";

const Appointment = () => {
  const { docId } = useParams();
  const { currencySymbol, user } = useContext(AppContext);
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      // Define static doctors data
      const staticDoctors = [
        {
          _id: 'doc1',
          name: "Dr. John Smith",
          speciality: "General Physician",
          experience: "8+ years",
          fees: 100,
          about: "Experienced general physician with expertise in primary care and preventive medicine.",
          image: assets.doc1,
          degree: "MBBS, MD"
        },
        {
          _id: 'doc2',
          name: "Dr. Sarah Wilson",
          speciality: "Pediatrician",
          experience: "6+ years",
          fees: 120,
          about: "Dedicated pediatrician specializing in child healthcare and development.",
          image: assets.doc2,
          degree: "MBBS, MD Pediatrics"
        },
        {
          _id: 'doc3',
          name: "Dr. Michael Brown",
          speciality: "Dermatologist",
          experience: "10+ years",
          fees: 150,
          about: "Expert dermatologist specializing in skin conditions and cosmetic procedures.",
          image: assets.doc3,
          degree: "MBBS, MD Dermatology"
        }
      ];

      // First try to get from static data
      const staticDoctor = staticDoctors.find(d => d._id === docId);
      if (staticDoctor) {
        console.log('Using static doctor data:', staticDoctor);
        setDocInfo(staticDoctor);
        setLoading(false);
        return;
      }

      // If not in static data, try API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/doctors/${docId}`);
      const data = await response.json();
      
      if (response.ok && data) {
        console.log('Fetched doctor data:', data);
        const doctorData = {
          ...data,
          name: data.user?.name || data.name,
          image: data.user?.photo || assets.doc1
        };
        setDocInfo(doctorData);
      } else {
        console.error('Failed to fetch doctor:', data.message);
        setError('Doctor not found');
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
      setError('Error loading doctor information');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSlots = async() => {
    setDocSlots([])

    // getting current date
    let today = new Date()

    for(let i=0; i<7; i++){
      //getting date with index
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate() + i)

      //setting end time of the date with index
      let endTime = new Date(currentDate) // Create end time based on currentDate
      endTime.setHours(21,0,0,0)

      // setting hours
      if(today.getDate() === currentDate.getDate()){
        currentDate.setHours(currentDate.getHours()>10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes()>30 ? 30 : 0)
      } else {
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots = []

      while(currentDate < endTime){
        let formattedTime = currentDate.toLocaleTimeString([],{hour: '2-digit', minute: '2-digit'})
     
        // add slot to array with formatted date
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime,
          date: currentDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })
        })

        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }

      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  useEffect(() => {
    if (docId) {
      console.log('Fetching doctor with ID:', docId);
      fetchDocInfo();
    }
  }, [docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSlots();
    }
  }, [docInfo]);

  return (
    <div className="container mx-auto px-4 py-8">
      {loading ? (
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse text-lg">Loading doctor information...</div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => navigate('/doctors')}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg"
          >
            Back to Doctors
          </button>
        </div>
      ) : !docInfo ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-red-500">Doctor not found</p>
          <button 
            onClick={() => navigate('/doctors')}
            className="mt-4 bg-primary text-white px-4 py-2 rounded-lg"
          >
            Back to Doctors
          </button>
        </div>
      ) : (
      <div>
        {/* Doctors details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img className="bg-primary w-full sm:max-w-72 rounded-lg" src={docInfo.image} alt="" />
          </div>

          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0">
            {/* Doc Info */}
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">{docInfo.experience}</button>
            </div>

            {/* doctors about */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} />
              </p>
              <p className="text-sm text-gray-500 max-w-[700px] mt-1">{docInfo.about}</p>
            </div>
              <p className="text-gray-500 font-medium mt-4">Appointment fee: <span className="text-gray-600">{currencySymbol}{docInfo.fees}</span></p>
          </div>
        </div>

        {/* Booking slots */}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {
              docSlots.length && docSlots.map((item,index)=>(
                <div onClick={()=> {
                  setSlotIndex(index);
                  setSlotTime(''); // Reset the selected time when date changes
                }} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
            }
          </div>

          <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
            {docSlots.length && docSlots[slotIndex].map((item,index)=>(
              <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
                {item.time.toLowerCase()} 
              </p>
            ))}
          </div>
          <button 
            onClick={async () => {
              if (!slotTime) {
                alert('Please select a time slot');
                return;
              }
              if (!user) {
                alert('Please login to book an appointment');
                navigate('/login');
                return;
              }

              try {
                const selectedSlot = docSlots[slotIndex].find(slot => slot.time === slotTime);
                if (!selectedSlot) {
                  alert('Please select a valid time slot');
                  return;
                }
                
                const selectedDate = selectedSlot.datetime.toISOString().split('T')[0];
                const token = localStorage.getItem('token');
                
                if (!token) {
                  alert('Please login to book an appointment');
                  navigate('/login');
                  return;
                }

                // Check if this is a static doctor (IDs starting with 'doc')
                if (docId.startsWith('doc')) {
                  alert('Demo mode: Booking is only available with registered doctors');
                  return;
                }

                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    doctorId: docId,
                    appointmentDate: selectedDate,
                    timeSlot: slotTime
                  }),
                });
                
                const data = await response.json();
                
                if (response.ok) {
                  alert('Appointment booked successfully!');
                  navigate('/my-appointments');
                } else {
                  alert(data.message || 'Failed to book appointment. Please try again.');
                }
              } catch (error) {
                console.error('Error booking appointment:', error);
                alert('Error booking appointment. Please try again.');
              }
            }}
            className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
          >
            Book an appointment
          </button>
        </div>

        {/* Listing Related Doctors */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality}/>
      </div>
      )}
    </div>
  );
};

export default Appointment;
