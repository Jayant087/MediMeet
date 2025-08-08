const User = require('../models/User');
const path = require('path');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const { name, phoneNumber, address, gender, dateOfBirth, photo } = req.body;

        // Find user and update
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (photo) user.photo = photo;
        if (address) {
            user.address = {
                street: address.street || user.address?.street,
                city: address.city || user.address?.city,
                state: address.state || user.address?.state,
                zipCode: address.zipCode || user.address?.zipCode
            };
        }
        if (gender) user.gender = gender;
        if (dateOfBirth) user.dateOfBirth = dateOfBirth;

        // Save the updated user
        const updatedUser = await user.save();

        // Remove password from response
        const userResponse = updatedUser.toObject();
        delete userResponse.password;

        res.json({
            success: true,
            data: userResponse
        });
    } catch (err) {
        console.error('Profile update error:', err);
        res.status(500).json({ 
            success: false,
            message: err.message || 'Error updating profile'
        });
    }
};

// @desc    Upload profile photo
// @route   POST /api/users/profile/photo
// @access  Private
exports.uploadProfilePhoto = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create URL for the uploaded file
        const photoUrl = `/uploads/profiles/${req.file.filename}`;
        
        // Update user's photo field
        user.photo = photoUrl;
        await user.save();

        // Send the complete URL in response
        const fullUrl = `${req.protocol}://${req.get('host')}${photoUrl}`;
        
        res.json({
            success: true,
            photoUrl: photoUrl,
            fullUrl: fullUrl,
            user: user
        });
    } catch (err) {
        console.error('Photo upload error:', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Error uploading photo'
        });
    }
};
