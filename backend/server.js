const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// CORS configuration to allow requests from all origins
app.use(cors({
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
}));

// Handle pre-flight requests
app.options('*', cors());

// MongoDB connection
const mongoURI = process.env.MONGODB_CONNECTION_STRING; // MongoDB connection string from environment variable
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define schema and model
const EmailSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }
});

const Email = mongoose.model('Email', EmailSchema);

// Routes
app.post('/submit', async (req, res) => {
    try {
        const { email } = req.body;
        const newEmail = new Email({ email });
        await newEmail.save();
        res.status(200).json({ message: 'Thanks for connecting with us!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed submission' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
