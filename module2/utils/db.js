const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        // const conn = await mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_CLUSTER}/${process.env.MONGO_DB}?${process.env.MONGO_OPTIONS}`);
        console.log(`Database connected : ${conn.connection.host}`);
    } catch (error) {
        console.log("Database connection error : " ,error);
        
    }
};

module.exports = connectDB;