import mongoose from "mongoose";

async function connectDb() {
    const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string

    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB');

        // You can perform database operations here

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    } 
}

connectDb();