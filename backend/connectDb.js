const mongoose = require('mongoose');
const { ENV_VARS } = require('./config/envVar.js');

const mongoURI = ENV_VARS.MONGODB_URI;

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB Successfully');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}

module.exports = connectToMongo;
