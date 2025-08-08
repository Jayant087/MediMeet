const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const User = require('./models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected...');

    // Create a test user first
    const user = await User.create({
      name: 'Dr. John Doe',
      email: 'johndoe@example.com',
      password: await bcrypt.hash('123456', 10),
      role: 'doctor'
    });

    // Create a test doctor
    await Doctor.create({
      user: user._id,
      speciality: 'General Physician',
      experience: 5,
      qualification: 'MBBS, MD',
      clinicAddress: '123 Medical Street',
      fees: 100,
      timings: [
        {
          day: 'Monday',
          startTime: '09:00',
          endTime: '17:00',
          isAvailable: true
        }
      ],
      rating: 4.5
    });

    console.log('Test data created successfully');
    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

connectDB();
