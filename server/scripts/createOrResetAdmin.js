require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/complaint_management';

async function run() {
  const email = process.argv[2];
  const password = process.argv[3] || 'admin123';
  const name = process.argv[4] || 'Administrator';

  if (!email) {
    console.error('Usage: node createOrResetAdmin.js admin@example.com [password] [name]');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.role = 'admin';
      user.name = name;
      await user.save();
      console.log('Updated existing user to admin and reset password for:', email);
    } else {
      user = new User({ name, email: email.toLowerCase(), password, role: 'admin' });
      await user.save();
      console.log('Created new admin user with email:', email);
    }
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
