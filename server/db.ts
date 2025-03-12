import mongoose from 'mongoose';

// MongoDB Atlas connection URL (using the provided string from the prompt)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kadirivignesh2005:sai12345@cluster0.s7qw2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
