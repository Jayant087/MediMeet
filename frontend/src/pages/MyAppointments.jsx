import React, { useContext, useEffect, useState } from "react";
import { AppContext } from '../context/AppContext';
import { assets } from "../assets/assets";

const MyAppointments = () => {
  const { user, getPatientAppointments, updateAppointmentStatus, doctors } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get appointments for current user
  const userAppointments = getPatientAppointments(user?.id || '');
  
  // Map appointments with doctor information
  const appointmentsWithDoctors = userAppointments.map(appointment => {
    const doctor = doctors.find(doc => doc._id === appointment.doctorId);
    return {
      ...appointment,
      doctor: doctor ? {
        _id: doctor._id,
        name: doctor.name,
        speciality: doctor.speciality,
        image: doctor.image,
        address: doctor.address
      } : {
        _id: appointment.doctorId,
        name: appointment.doctorName,
        speciality: 'Unknown',
        image: assets.profile_pic,
        address: { line1: 'Address not available', line2: '' }
      }
    };
  });

  // Simulate loading for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
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

  if (!appointmentsWithDoctors || appointmentsWithDoctors.length === 0) {
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
        {appointmentsWithDoctors.map((appointment, index) => (
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
