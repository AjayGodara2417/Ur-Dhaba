const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const restaurants = require('./restaurantData');
require('dotenv').config({ path: '../.env' });

const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/urdhaba';

// Connect to MongoDB
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => {
        console.error('MongoDB Connection Error:', err);
        process.exit(1);
    });

// Import Data
const importData = async () => {
    try {
        // Clear existing data
        await Restaurant.deleteMany();
        
        // Insert new data
        await Restaurant.insertMany(restaurants);
        
        console.log('Data imported successfully');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

// Delete Data
const deleteData = async () => {
    try {
        await Restaurant.deleteMany();
        console.log('Data deleted successfully');
        process.exit();
    } catch (error) {
        console.error('Error deleting data:', error);
        process.exit(1);
    }
};

// Check command line arguments
if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData();
} else {
    console.log('Please use either -i (import) or -d (delete) as an argument');
    process.exit(1);
}
