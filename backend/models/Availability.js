const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlots: [{
    time: String,
    isBooked: {
      type: Boolean,
      default: false
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment'
    }
  }]
}, {
  timestamps: true
});

// Compound index to ensure unique doctor-date combinations
availabilitySchema.index({ doctor: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Availability', availabilitySchema);
