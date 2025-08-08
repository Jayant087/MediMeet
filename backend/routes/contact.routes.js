const express = require('express');
const router = express.Router();
const {
  createContact,
  getAllContacts,
  updateContactStatus
} = require('../controllers/contact.controller');
const auth = require('../middleware/auth');

// @route   POST /api/contact
// @desc    Send contact form
// @access  Public
router.post('/', createContact);

// @route   GET /api/contact
// @desc    Get all contact messages
// @access  Private (Admin)
router.get('/', auth, getAllContacts);

// @route   PUT /api/contact/:id
// @desc    Update contact status
// @access  Private (Admin)
router.put('/:id', auth, updateContactStatus);

module.exports = router;
