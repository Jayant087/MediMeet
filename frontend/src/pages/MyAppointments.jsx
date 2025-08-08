import React, { useContext, useEffect, useState } from "react";
import { AppContext } from '../context/AppContext';
import { assets } from "../assets/assets";

const MyAppointments = () => {
  const { user } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/appointments/my-appointments`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAppointments(data);
        } else {
          // If API fails, use static data for demo
          const staticAppointments = [
            {
              _id: 'apt1',
              doctor: {
                _id: 'doc1',
                name: "Dr. John Smith",
                speciality: "General Physician",
                image: assets.doc1,
                address: {
                  line1: "123 Medical Street",
                  line2: "Healthcare Complex, City Center"
                }
              },
              appointmentDate: "2025-07-25",
              timeSlot: "8:30 PM",
              status: "scheduled"
            },
            {
              _id: 'apt2',
              doctor: {
                _id: 'doc2',
                name: "Dr. Sarah Wilson",
                speciality: "Pediatrician",
                image: assets.doc2,
                address: {
                  line1: "456 Children's Lane",
                  line2: "Pediatric Center, West Area"
                }
              },
              appointmentDate: "2025-07-26",
              timeSlot: "10:00 AM",
              status: "scheduled"
            }
          ];
          setAppointments(staticAppointments);
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-lg text-gray-600">Loading appointments...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-gray-600">No appointments found</p>
      </div>
    );
  }

  return (
    <div>
      <p className="pb-3 mt-12 font-medium text-zinc-700 border-b">My appointments</p>
      <div>
        {appointments.map((appointment, index) => (
          <div className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b" key={appointment._id || index}>
            <div>
              <img 
                className="w-32 bg-indigo-50" 
                src={appointment.doctor.image || assets.doc1} 
                alt={appointment.doctor.name}
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">{appointment.doctor.name}</p>
              <p>{appointment.doctor.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{appointment.doctor.address?.line2}</p>
              <p className="text-xs">{appointment.doctor.address?.line1}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">Date & Time: </span>
                {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} | {appointment.timeSlot}
              </p>
            </div>
            <div></div>
            <div className="flex flex-col gap-2 justify-end">
              {appointment.status === 'scheduled' && !appointment.isPaid && (
                <button className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-primary hover:text-white transition-all duration-300 rounded">
                  Pay Online
                </button>
              )}
              <button 
                onClick={async () => {
                  if (window.confirm('Are you sure you want to cancel this appointment?')) {
                    try {
                      const response = await fetch(
                        `${import.meta.env.VITE_API_URL}/api/appointments/${appointment._id}`,
                        {
                          method: 'DELETE',
                          headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json'
                          }
                        }
                      );

                      if (response.ok) {
                        // Remove the appointment from the list
                        setAppointments(prevAppointments => 
                          prevAppointments.filter(apt => apt._id !== appointment._id)
                        );
                      } else {
                        alert('Failed to cancel appointment');
                      }
                    } catch (error) {
                      console.error('Error canceling appointment:', error);
                      alert('Error canceling appointment');
                    }
                  }
                }}
                className="text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300 rounded"
              >
                Cancel appointment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
