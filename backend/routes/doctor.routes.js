const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  getDoctorsBySpeciality,
  createDoctor,
  addReview
} = require('../controllers/doctor.controller');
const auth = require('../middleware/auth');

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', getAllDoctors);

// @route   GET /api/doctors/speciality/:speciality
// @desc    Get doctors by speciality
// @access  Public
router.get('/speciality/:speciality', getDoctorsBySpeciality);

// @route   GET /api/doctors/:id
// @desc    Get doctor by ID
// @access  Public
router.get('/:id', getDoctorById);

// @route   POST /api/doctors
// @desc    Create doctor profile
// @access  Private (Admin only)
router.post('/', auth, createDoctor);

// @route   POST /api/doctors/:id/reviews
// @desc    Add review for doctor
// @access  Private
router.post('/:id/reviews', auth, addReview);

module.exports = router;
