const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// MongoDB connection
const mongoURI = process.env.MONGODB_CONNECTION_STRING;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define schema and model
const EmailSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }
});

const Email = mongoose.model('Email', EmailSchema);

// Default route to show an h1 element
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome</title>
        </head>
        <body>
            <h1>Welcome to My Express App</h1>
        </body>
        </html>
    `);
});

// Other routes
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

module.exports = app; // For Vercel or other serverless environments
