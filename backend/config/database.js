import mongoose from 'mongoose';
import { connectSQLite } from './sqlite-database.js';

const DB_TYPE = process.env.DB_TYPE || 'mongodb';

export const connectDB = async () => {
  if (DB_TYPE === 'sqlite') {
    try {
      connectSQLite();
      console.log('Using SQLite database for testing');
    } catch (error) {
      console.error('SQLite connection error:', error);
      process.exit(1);
    }
  } else {
    try {
      const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/it-recruit';
      await mongoose.connect(mongoURI);
      console.log('MongoDB connected successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }

    // Обработка отключения
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
  }
};

export const getDBType = () => DB_TYPE;

