// بارگذاری dotenv برای دسترسی به متغیرهای محیطی
require('dotenv').config();
const mongoose = require('mongoose');

const dbConnect = async () => {
  try {
    // اتصال به MongoDB با استفاده از URI در فایل .env
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error('MONGO_URI not defined in .env');

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // اگر اتصال برقرار نشد، برنامه بسته شود
  }
};

module.exports = dbConnect;
