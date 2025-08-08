const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const Doctor = require('../models/Doctor');

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      appointmentDate,
      timeSlot,
      symptoms,
      previousMedicalHistory
    } = req.body;

    // Check doctor availability
    const availability = await Availability.findOne({
      doctor: doctorId,
      date: new Date(appointmentDate)
    });

    if (!availability) {
      return res.status(400).json({ message: 'No availability for selected date' });
    }

    // Check if time slot is available
    const selectedSlot = availability.timeSlots.find(
      slot => slot.time === timeSlot && !slot.isBooked
    );

    if (!selectedSlot) {
      return res.status(400).json({ message: 'Time slot not available' });
    }

    // Get doctor details for fees
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      appointmentDate,
      timeSlot,
      symptoms,
      previousMedicalHistory,
      amount: doctor.fees
    });

    // Update availability
    selectedSlot.isBooked = true;
    selectedSlot.appointmentId = appointment._id;
    await availability.save();

    res.status(201).json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's appointments
// @route   GET /api/appointments/my-appointments
// @access  Private
exports.getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate('doctor')
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name email photo'
        }
      })
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's appointments by ID
// @route   GET /api/appointments/user/:userId
// @access  Private
exports.getUserAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.params.userId })
      .populate('doctor')
      .populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name email photo'
        }
      })
      .sort({ appointmentDate: -1 });

    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check ownership
    if (appointment.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Update appointment
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedAppointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check ownership
    if (appointment.patient.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Free up the time slot
    await Availability.updateOne(
      {
        doctor: appointment.doctor,
        date: appointment.appointmentDate,
        'timeSlots.appointmentId': appointment._id
      },
      {
        $set: {
          'timeSlots.$.isBooked': false,
          'timeSlots.$.appointmentId': null
        }
      }
    );

    await appointment.remove();

    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
