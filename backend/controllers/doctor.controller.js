const Doctor = require('../models/Doctor');
const Availability = require('../models/Availability');
const mongoose = require('mongoose');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('user', 'name email photo')
      .select('-reviews');
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get doctor by ID
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        message: 'Invalid doctor ID format. Please use a valid ObjectId.' 
      });
    }

    const doctor = await Doctor.findById(id)
      .populate('user', 'name email photo')
      .populate('reviews.user', 'name photo');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get doctors by speciality
// @route   GET /api/doctors/speciality/:speciality
// @access  Public
exports.getDoctorsBySpeciality = async (req, res) => {
  try {
    const doctors = await Doctor.find({ speciality: req.params.speciality })
      .populate('user', 'name email photo')
      .select('-reviews');
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create doctor profile
// @route   POST /api/doctors
// @access  Private (Admin only)
exports.createDoctor = async (req, res) => {
  try {
    const newDoctor = await Doctor.create({
      user: req.body.userId,
      speciality: req.body.speciality,
      experience: req.body.experience,
      qualification: req.body.qualification,
      clinicAddress: req.body.clinicAddress,
      fees: req.body.fees,
      timings: req.body.timings
    });

    res.status(201).json(newDoctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add review
// @route   POST /api/doctors/:id/reviews
// @access  Private
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = doctor.reviews.find(
      review => review.user.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Doctor already reviewed' });
    }

    // Add review
    const review = {
      user: req.user.id,
      rating: Number(rating),
      comment
    };

    doctor.reviews.push(review);

    // Update rating
    doctor.rating =
      doctor.reviews.reduce((acc, item) => item.rating + acc, 0) /
      doctor.reviews.length;

    await doctor.save();
    res.status(201).json({ message: 'Review added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
