const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  speciality: {
    type: String,
    required: [true, 'Please provide doctor speciality'],
    enum: [
      'General Physician',
      'Dermatologist',
      'Pediatrician',
      'Gynecologist',
      'Neurologist',
      'Gastroenterologist'
    ]
  },
  experience: {
    type: Number,
    required: [true, 'Please provide years of experience']
  },
  qualification: {
    type: String,
    required: [true, 'Please provide qualification']
  },
  clinicAddress: {
    type: String,
    required: [true, 'Please provide clinic address']
  },
  fees: {
    type: Number,
    required: [true, 'Please provide consultation fees']
  },
  timings: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String,
    isAvailable: {
      type: Boolean,
      default: true
    }
  }],
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Doctor', doctorSchema);
