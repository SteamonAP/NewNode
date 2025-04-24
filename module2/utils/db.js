const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected : ${conn.connection.host}`);
    } catch (error) {
        console.log("Database connection error : " ,error);
        
    }
};

module.exports = connectDB;