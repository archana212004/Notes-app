const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notes-app';
        
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(mongoURI);
        
        console.log('✅ MongoDB Connected Successfully');
        return true;
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        console.log('\n📝 Troubleshooting Steps:');
        console.log('1. Make sure MongoDB is installed');
        console.log('2. Check if MongoDB service is running (services.msc)');
        console.log('3. Try using MongoDB Compass to verify connection');
        console.log('4. Check if the database URL is correct in .env file\n');
        return false;
    }
};

module.exports = connectDB; 