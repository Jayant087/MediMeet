const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getUserAppointments,
  getMyAppointments,
  updateAppointment,
  cancelAppointment
} = require('../controllers/appointment.controller');
const auth = require('../middleware/auth');

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private
router.post('/', auth, createAppointment);

// @route   GET /api/appointments/my-appointments
// @desc    Get current user's appointments
// @access  Private
router.get('/my-appointments', auth, getMyAppointments);

// @route   GET /api/appointments/user/:userId
// @desc    Get user's appointments
// @access  Private
router.get('/user/:userId', auth, getUserAppointments);

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', auth, updateAppointment);

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', auth, cancelAppointment);

module.exports = router;
