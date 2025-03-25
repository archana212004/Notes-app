require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const connectDB = require('./config/db');

// Import models first
const User = require('./Models/user_model');
const Note = require('./Models/note_model');

// Import routes after models
const userRoutes = require("./Routes/user_routes");
const noteRoutes = require("./Routes/note_routes");

const app = express();

// CORS Configuration
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notes-app';
const jwtSecret = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5022;

// Routes
app.use("/api", userRoutes);
app.use("/api/notes", noteRoutes);

// Health check route
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        const connected = await connectDB();
        if (!connected) {
            console.error("Failed to connect to MongoDB. Exiting...");
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
            console.log(`📝 API URL: http://localhost:${PORT}`);
            console.log(`💾 MongoDB URL: ${process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/notes-app'}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

module.exports = app;
