require('dotenv').config();
const mongoose = require('mongoose');

const clearDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully!');

    console.log('Dropping the old attendances collection...');
    try {
      await mongoose.connection.db.dropCollection('attendances');
      console.log('✅ Successfully removed all attendance records (including Shahid\'s)!');
    } catch (err) {
      if (err.code === 26) {
        console.log('✅ Collection already empty or does not exist.');
      } else {
        console.error('Error dropping collection:', err);
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

clearDatabase();
