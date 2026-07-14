require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/complaint_management';

async function run() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node findUser.js user@example.com');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    const user = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!user) {
      console.log('No user found with email:', email);
    } else {
      console.log('User found:');
      console.log({ id: user._id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
