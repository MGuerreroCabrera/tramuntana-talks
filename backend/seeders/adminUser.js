const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6, select: false },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

const seedAdmin = async () => {
  try {
    const fullName = process.env.BACKOFFICE_ADMIN_FULL_NAME;
    const email = process.env.BACKOFFICE_ADMIN_EMAIL;
    const password = process.env.BACKOFFICE_ADMIN_PASSWORD;

    if (!fullName || !email || !password) {
      throw new Error('BACKOFFICE_ADMIN_FULL_NAME, BACKOFFICE_ADMIN_EMAIL and BACKOFFICE_ADMIN_PASSWORD are required');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const deletedUsers = await User.deleteMany({});
    console.log(`Deleted ${deletedUsers.deletedCount} existing user(s)`);

    const hashedPassword = await bcrypt.hash(password, 12);

    const adminUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    console.log('Backoffice user created:', adminUser.email);
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedAdmin();
