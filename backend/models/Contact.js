const mongoose = require('mongoose');
const validator = require('validator');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    validate: [validator.isEmail, 'Please provide a valid email']
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject']
  },
  message: {
    type: String,
    required: [true, 'Please provide your message']
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'responded'],
    default: 'unread'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
