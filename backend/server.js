const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: '*', // Allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    preflightContinue: false,
    optionsSuccessStatus: 204
}));
app.use(bodyParser.json()); // Parse JSON bodies

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

app.get('/', async (req, res) => {
    res.send("Welcome to backend");
});

app.post('/submit', async (req, res) => {
    try {
        const { email } = req.body;
        const newEmail = new Email({ email });
        await newEmail.save();
        res.status(200).json({ message: 'Thanks for connecting with us!' });
    } catch (err) {
        res.status(500).json({ error: 'Failed submission', details: err.message });
    }
});

// Handle pre-flight requests for all routes
app.options('*', cors());

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
