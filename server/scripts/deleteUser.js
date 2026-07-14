require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/complaint_management';

async function run() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: node deleteUser.js user@example.com');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const res = await User.deleteOne({ email: email.toLowerCase() });
    if (res.deletedCount === 0) {
      console.log('No user found with email:', email);
    } else {
      console.log('Deleted user with email:', email);
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
