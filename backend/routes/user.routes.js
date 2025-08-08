// Create uploads directory if it doesn't exist
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, '../uploads/profiles');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { 
    getUserProfile, 
    updateUserProfile,
    uploadProfilePhoto,
} = require('../controllers/user.controller');

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, getUserProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, updateUserProfile);

// @route   POST /api/users/profile/photo
// @desc    Upload profile photo
// @access  Private
router.post('/profile/photo', auth, upload, uploadProfilePhoto);

module.exports = router;
