const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Please provide appointment date']
  },
  timeSlot: {
    type: String,
    required: [true, 'Please provide appointment time']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  symptoms: {
    type: String,
    required: [true, 'Please provide symptoms']
  },
  previousMedicalHistory: String,
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  paymentId: String,
  amount: {
    type: Number,
    required: true
  },
  notes: String,
  prescription: {
    medicines: [{
      name: String,
      dosage: String,
      duration: String,
      instructions: String
    }],
    additionalNotes: String,
    prescribedDate: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Appointment', appointmentSchema);
